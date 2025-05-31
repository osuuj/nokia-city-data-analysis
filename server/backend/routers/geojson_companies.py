import os
from typing import Any, Dict, Optional

from fastapi import (  # pyright: ignore[reportMissingImports]
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
)
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings  # pyright: ignore[reportMissingImports]
from ..database import get_db  # pyright: ignore[reportMissingImports]
from ..middleware import limiter  # pyright: ignore[reportMissingImports]
from ..services.company_service import (  # pyright: ignore[reportMissingImports]
    get_business_data_by_city_keyset,
    get_company_count_by_city,
)
from ..services.geojson_service import create_geojson_feature_collection

# Check if we're in production environment
is_production = os.environ.get("ENVIRONMENT", "dev") != "dev"


# Conditionally create decorator factories
def rate_limit_if_production(limit_string):
    """Apply rate limiting only in production environment.

    In test environments, we completely bypass the rate limiter to avoid
    the 'No request or websocket argument' error during testing.
    """

    def decorator(func):
        # Skip rate limiting in test environment
        if (
            os.environ.get("ENVIRONMENT") == "test"
            or os.environ.get("BYPASS_RATE_LIMIT") == "true"
        ):
            return func

        # Apply rate limiting in production
        if is_production:
            return limiter.limit(limit_string)(func)

        # No rate limiting in development
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
        1000, ge=1, le=5000, description="Number of records to return per batch"
    ),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Return business data as a GeoJSON FeatureCollection with pagination support.

    Args:
        request: The incoming HTTP request object.
        city: City name to filter by
        last_id: Last seen business_id for pagination
        limit: Number of records to return per batch
        db: Database session

    Returns:
        Dict[str, Any]: GeoJSON FeatureCollection with pagination metadata
    """
    try:
        businesses = await get_business_data_by_city_keyset(db, city, last_id, limit)

        # Get total count only on the first page
        total = await get_company_count_by_city(db, city) if last_id is None else None

        geojson = create_geojson_feature_collection(businesses)

        # Add pagination metadata
        geojson["metadata"] = {
            "total": total,
            "limit": limit,
            "last_id": businesses[-1].business_id if businesses else None,
            "has_more": len(businesses) == limit,
        }

        return geojson
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating GeoJSON: {str(e)}"
        )
