import logging
import os
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..database import get_db
from ..middleware import limiter
from ..services.company_service import (
    get_business_data_by_city_keyset,
    get_company_count_by_city,
)
from ..services.geojson_service import create_geojson_feature_collection

logger = logging.getLogger(__name__)

# Detect whether we are in production (anything not explicitly "dev" or "test")
is_production = os.environ.get("ENVIRONMENT", "dev") not in ("dev", "test")


def rate_limit_if_production(limit_string: str):
    """Only apply rate limiting in production; bypass in dev/test."""

    def decorator(func):
        if (
            os.environ.get("ENVIRONMENT") == "test"
            or os.environ.get("BYPASS_RATE_LIMIT") == "true"
        ):
            # Don't wrap in tests or when explicitly bypassing
            return func

        if is_production:
            # In production, apply the slowapi limiter with the given string
            return limiter.limit(limit_string)(func)

        # In development, don't rate-limit
        return func

    return decorator


router = APIRouter()


@router.get("/companies.geojson", response_model=Dict[str, Any])
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def get_companies_geojson(
    request: Request,
    city: str = Query(..., description="City name to filter by"),
    last_id: Optional[str] = Query(
        None, description="Last seen business_id for pagination"
    ),
    limit: int = Query(
        5000,  # default and max = 5000
        ge=1,
        le=5000,
        description="Number of records to return per batch (max 5000)",
    ),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Return business data as a GeoJSON FeatureCollection with pagination support.

    Up to `limit` rows are returned per call. When `last_id` is provided,
    the service returns the "next page" of results after that ID.
    """
    try:
        logger.info(
            f"[GeoJSON] Request parameters - city='{city}', last_id='{last_id}', limit={limit}"
        )

        # 1) Fetch both the address rows AND the next cursor id in one call:
        businesses, next_last_id = await get_business_data_by_city_keyset(
            db, city, last_id, limit
        )

        # 2) Only compute total row count on the very first page:
        total = await get_company_count_by_city(db, city) if last_id is None else None

        # 3) Build the GeoJSON FeatureCollection from these rows:
        geojson = create_geojson_feature_collection(businesses)

        # 4) If next_last_id is not None, it means we got exactly `limit` IDs
        has_more = next_last_id is not None

        geojson["metadata"] = {
            "total": total,
            "limit": limit,
            "last_id": next_last_id,
            "has_more": has_more,
        }

        logger.info(
            f"[GeoJSON] Response metadata - total={total}, has_more={has_more}, last_id={next_last_id}"
        )
        return geojson

    except Exception as e:
        logger.error(f"[GeoJSON] Error generating GeoJSON for city='{city}': {e}")
        raise HTTPException(
            status_code=500, detail=f"Error generating GeoJSON: {str(e)}"
        )
