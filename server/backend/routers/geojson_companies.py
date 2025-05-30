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
    get_business_data_by_city,
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
    limit: Optional[int] = Query(None, description="Optional limit for results"),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Return business data as a GeoJSON FeatureCollection.

    Args:
        request: The incoming HTTP request object.
        city (str): City name to filter by
        limit (Optional[int]): Optional limit for results
        db (AsyncSession): Database session

    Returns:
        Dict[str, Any]: GeoJSON FeatureCollection
    """
    try:
        businesses = await get_business_data_by_city(db, city)

        # Apply limit if specified
        if limit and limit > 0:
            businesses = businesses[:limit]

        return create_geojson_feature_collection(businesses)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating GeoJSON: {str(e)}"
        )
