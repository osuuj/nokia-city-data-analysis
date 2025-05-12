"""Companies API router.

This module handles API routes for accessing company data.
"""

import logging
import os
from typing import List, Optional

from fastapi import (  # pyright: ignore[reportMissingImports]
    APIRouter,
    Depends,
    Query,
    Request,
)
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..database import get_db
from ..middleware import limiter
from ..schemas.company_schema import BusinessData
from ..services.company_service import (
    get_business_data_by_city,
    get_cities,
    get_companies_by_industry,
    get_industries,
)

# Configure logger
logger = logging.getLogger(__name__)

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


@router.get("/businesses_by_city", response_model=List[BusinessData])
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def read_businesses_by_city(
    request: Request,
    city: str = Query(..., description="City name to filter by"),
    db: AsyncSession = Depends(get_db),
) -> List[BusinessData]:
    """Retrieve business data by city.

    Args:
        request: The incoming HTTP request object.
        city: City name to filter by
        db: Database session

    Returns:
        List of business data
    """
    try:
        logger.debug(f"Fetching businesses for city: {city}")
        return await get_business_data_by_city(db, city)
    except Exception as e:
        logger.error(f"Error fetching businesses by city: {e}")
        raise


@router.get("/businesses_by_industry", response_model=List[BusinessData])
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def read_businesses_by_industry(
    request: Request,
    industry_letter: str = Query(..., description="Industry letter code to filter by"),
    city: Optional[str] = Query(None, description="Optional city to filter by"),
    limit: int = Query(
        100, description="Maximum number of results to return", ge=1, le=500
    ),
    db: AsyncSession = Depends(get_db),
) -> List[BusinessData]:
    """Retrieve business data by industry.

    Args:
        request: The incoming HTTP request object.
        industry_letter: Industry letter code to filter by
        city: Optional city to filter by
        limit: Maximum number of results to return
        db: Database session

    Returns:
        List of business data
    """
    try:
        logger.debug(
            f"Fetching businesses for industry: {industry_letter}, city: {city}, limit: {limit}"
        )
        return await get_companies_by_industry(db, industry_letter, limit, city)
    except Exception as e:
        logger.error(f"Error fetching businesses by industry: {e}")
        raise


@router.get("/cities", response_model=List[str])
@rate_limit_if_production(settings.RATE_LIMIT_DEFAULT)
async def read_cities(
    request: Request, db: AsyncSession = Depends(get_db)
) -> List[str]:
    """Retrieve all cities.

    Args:
        request: The incoming HTTP request object.
        db: Database session

    Returns:
        List of cities
    """
    try:
        logger.debug("Fetching list of all cities")
        return await get_cities(db)
    except Exception as e:
        logger.error(f"Error fetching cities: {e}")
        raise


@router.get("/industries", response_model=List[str])
@rate_limit_if_production(settings.RATE_LIMIT_DEFAULT)
async def read_industries(
    request: Request, db: AsyncSession = Depends(get_db)
) -> List[str]:
    """Retrieve all industry letter codes.

    Args:
        request: The incoming HTTP request object.
        db: Database session

    Returns:
        List of industry letter codes
    """
    try:
        logger.debug("Fetching list of all industry codes")
        return await get_industries(db)
    except Exception as e:
        logger.error(f"Error fetching industries: {e}")
        raise
