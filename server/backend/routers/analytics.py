"""Analytics router module.

This module contains routes for analytics endpoints, mostly focused on
analyzing the distribution of companies across industries and cities.
"""

import os
from typing import Any, Dict, List, Optional

from fastapi import (  # pyright: ignore[reportMissingImports]
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
)
from pydantic import BaseModel, ConfigDict  # pyright: ignore[reportMissingImports]
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings

# Adjust these imports based on your actual project structure
from ..database import get_db
from ..middleware import limiter
from ..services.analytics_service import (
    compare_industry_by_cities,
    get_city_comparison,
    get_industries_by_city,
    get_industry_distribution,
    get_top_cities,
)
from ..utils.analytics_utils import filter_city_list

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


# from ..services import analytics_service # Placeholder for a potential service layer

router = APIRouter()

# --- Pydantic Schemas specific to Analytics ---


# Based on client/components/features/analytics/data/mock-data.ts -> IndustryDistributionData
class IndustryDistributionItem(BaseModel):
    name: str  # Will hold industry_letter or 'Other'
    value: int

    model_config = ConfigDict(from_attributes=True)


# New model for detailed response
class IndustryDistributionDetailItem(IndustryDistributionItem):
    others_breakdown: Optional[List[IndustryDistributionItem]] = (
        None  # Add breakdown field
    )


# Based on client/... -> CityComparisonData
class CityComparisonItem(BaseModel):
    industry: str
    # Dynamically add cities as keys, e.g., Helsinki: int, Espoo: int
    # This might be better handled by structuring the response differently if Pydantic struggles
    # Or potentially using Dict[str, int] if cities are not fixed
    # For simplicity, let's assume a fixed structure or handle transformation later

    model_config = ConfigDict(from_attributes=True)


# Based on client/... -> IndustriesByCityData
class IndustriesByCityItem(BaseModel):
    city: str
    # Similar to CityComparison, dynamic keys for industries
    # Example: Technology: int, Finance: int

    model_config = ConfigDict(from_attributes=True)


# Based on client/... -> TopCityData
class TopCityItem(BaseModel):
    city: str
    count: int  # Represents active company count

    model_config = ConfigDict(from_attributes=True)


# Add the missing model definition for IndustryComparisonResult
class IndustryComparisonResult(BaseModel):
    """Industry comparison between two cities result model."""

    industry_letter: str
    industry_description: str
    city1_count: int
    city2_count: int
    city1_percentage: float
    city2_percentage: float
    difference: float

    model_config = ConfigDict(from_attributes=True)


# --- Analytics API Endpoints ---


@router.get(
    "/industry-distribution",
    response_model=List[Dict[str, Any]],
    summary="Get overall industry distribution (Top 10 + Other) with breakdown",
    description="Calculates the distribution of the top 10 main industry letters, grouping others and providing breakdown.",
)
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def get_industry_distribution_endpoint(
    request: Request,
    cities: Optional[str] = Query(
        None, description="Comma-separated cities. If None, calculates for all."
    ),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:  # pyright: ignore[reportReturnType]
    """Get industry distribution with breakdown of 'Other' category.

    Args:
        request: The incoming HTTP request object.
        cities: Comma-separated list of cities to filter by
        db: Database session

    Returns:
        List of industry distribution items with Other breakdown
    """
    city_list = filter_city_list(cities) if cities else None
    try:
        # Get the result from the service layer
        result = await get_industry_distribution(
            db, city_list
        )  # pyright: ignore[reportReturnType]

        # Ensure we have a valid result
        if not result:
            return []

        # Validate the result is a list before returning
        if not isinstance(result, list):
            print(f"Warning: Expected list but got {type(result)}, converting to list")
            if result:
                return [result]
            return []

        return result
    except Exception as e:
        print(f"Error in get_industry_distribution_endpoint: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error getting industry distribution: {str(e)}"
        )


@router.get(
    "/city-comparison",
    response_model=List[Dict[str, Any]],
    summary="Compare normalized industry distribution (Top 10 + Other) across cities",
    description="Returns normalized (percentage) distribution for top 10 industries + Other across cities.",
)
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def get_city_comparison_endpoint(
    request: Request,
    cities: str = Query(..., description="Comma-separated list of cities (required)."),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Compare normalized industry distribution across cities.

    Args:
        request: The incoming HTTP request object.
        cities: Comma-separated list of cities to compare
        db: Database session

    Returns:
        List of dictionaries with city comparison data
    """
    city_list = filter_city_list(cities)
    if not city_list:
        raise HTTPException(
            status_code=400, detail="At least one city must be specified."
        )

    try:
        return await get_city_comparison(db, city_list)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching city comparison data: {str(e)}"
        )


@router.get(
    "/industries-by-city",
    response_model=List[Dict[str, Any]],
    summary="Get Top 10 + Other industry counts for each city",
    description="Returns data with cities and counts for top 10 industries and 'Other'.",
)
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def get_industries_by_city_endpoint(
    request: Request,
    cities: str = Query(..., description="Comma-separated list of cities (required)."),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Get Top 10 + Other industry counts for each city.

    Args:
        request: The incoming HTTP request object.
        cities: Comma-separated list of cities to analyze
        db: Database session

    Returns:
        List of dictionaries with industry counts by city
    """
    city_list = filter_city_list(cities)
    if not city_list:
        raise HTTPException(
            status_code=400, detail="At least one city must be specified."
        )

    try:
        return await get_industries_by_city(db, city_list)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching industries by city data: {str(e)}"
        )


@router.get(
    "/top-cities",
    response_model=List[TopCityItem],
    summary="Get top cities by active company count",
    description="Ranks cities based on the total number of unique active companies located there.",
)
@rate_limit_if_production(settings.RATE_LIMIT_DEFAULT)
async def get_top_cities_endpoint(
    request: Request,
    limit: int = Query(10, description="Number of top cities to return", ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:  # pyright: ignore[reportReturnType]
    """Get top cities by active company count.

    Args:
        request: The incoming HTTP request object.
        limit: Number of top cities to return
        db: Database session

    Returns:
        List of top cities by company count
    """
    try:
        # This typing inconsistency is intentional - FastAPI handles serialization
        result = await get_top_cities(db, limit)  # pyright: ignore[reportReturnType]
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error getting top cities: {str(e)}"
        )


@router.get(
    "/industry_comparison_by_cities", response_model=List[IndustryComparisonResult]
)
@rate_limit_if_production(settings.RATE_LIMIT_HEAVY)
async def compare_industry_by_cities_endpoint(
    request: Request,
    city1: str = Query(..., description="First city to compare"),
    city2: str = Query(..., description="Second city to compare"),
    db: AsyncSession = Depends(get_db),
) -> List[IndustryComparisonResult]:
    """Compare industry distribution between two cities.

    Args:
        request: The incoming HTTP request object.
        city1: First city to compare
        city2: Second city to compare
        db: Database session

    Returns:
        List of industry comparison results
    """
    try:
        return await compare_industry_by_cities(db, city1, city2)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error comparing industries: {str(e)}"
        )
