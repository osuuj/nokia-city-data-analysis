"""Tests for the analytics service module."""

import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.services.analytics_service import (
    get_city_comparison,
    get_industry_distribution,
    get_top_cities,
)


@pytest.mark.asyncio
async def test_get_industry_distribution(db: AsyncSession):
    """Test retrieving industry distribution data."""
    # Test without city filter
    result = await get_industry_distribution(db)

    # Basic validation
    assert isinstance(result, list)
    assert len(result) > 0

    # Validate structure
    for item in result:
        assert "name" in item
        assert "value" in item
        assert isinstance(item["value"], int)

        # Check if "Other" category has breakdown
        if item["name"] == "Other" and "others_breakdown" in item:
            assert isinstance(item["others_breakdown"], list)
            if item["others_breakdown"]:
                assert "name" in item["others_breakdown"][0]
                assert "value" in item["others_breakdown"][0]


@pytest.mark.asyncio
async def test_get_industry_distribution_with_city(db: AsyncSession):
    """Test retrieving industry distribution data with city filter."""
    # Get list of cities first
    cities = await get_cities_for_testing(db)
    if not cities:
        pytest.skip("No cities available for testing")

    # Test with city filter
    result = await get_industry_distribution(db, cities[:1])

    # Basic validation
    assert isinstance(result, list)
    # Note: May be empty if no data for this city

    # Validate structure if we got results
    if result:
        for item in result:
            assert "name" in item
            assert "value" in item


@pytest.mark.asyncio
async def test_get_city_comparison(db: AsyncSession):
    """Test retrieving city comparison data."""
    # Get list of cities first
    cities = await get_cities_for_testing(db)
    if len(cities) < 2:
        pytest.skip("Not enough cities available for comparison testing")

    # Test with multiple cities
    result = await get_city_comparison(db, cities[:2])

    # Basic validation
    assert isinstance(result, list)
    assert len(result) > 0

    # Validate structure
    for item in result:
        assert "industry" in item
        # Each city should be a field in the result
        for city in cities[:2]:
            assert city in item
            assert isinstance(item[city], int)


@pytest.mark.asyncio
async def test_get_top_cities(db: AsyncSession):
    """Test retrieving top cities data."""
    # Test with default limit
    result = await get_top_cities(db)

    # Basic validation
    assert isinstance(result, list)
    assert len(result) <= 10  # Default limit

    # Validate structure
    for item in result:
        assert "city" in item
        assert "count" in item
        assert isinstance(item["count"], int)

    # Test with custom limit
    custom_limit = 5
    result = await get_top_cities(db, custom_limit)
    assert len(result) <= custom_limit


# Helper function to get cities for testing
async def get_cities_for_testing(db: AsyncSession, limit: int = 3) -> list:
    """Helper to get cities for testing."""
    query = text(
        "SELECT DISTINCT city FROM addresses WHERE city IS NOT NULL LIMIT :limit"
    )
    result = await db.execute(query, {"limit": limit})
    return [row[0] for row in result]
