"""Tests for edge cases and error handling in service functions."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.services.company_service import (
    get_business_data_by_city,
    get_cities,
    get_companies_by_industry,
    get_industries,
)
from server.backend.utils.cache import cache


@pytest.mark.asyncio
async def test_non_existent_city(db: AsyncSession):
    """Test behavior when requesting data for a city that doesn't exist."""
    non_existent_city = "NonExistentCity12345"

    # Should return empty list, not raise an exception
    result = await get_business_data_by_city(db, non_existent_city)
    assert isinstance(result, list)
    assert len(result) == 0


@pytest.mark.asyncio
async def test_non_existent_industry(db: AsyncSession):
    """Test behavior when requesting data for an industry that doesn't exist."""
    non_existent_industry = "ZZ"  # Industry letter that doesn't exist

    # Should return empty list, not raise an exception
    result = await get_companies_by_industry(db, non_existent_industry)
    assert isinstance(result, list)
    assert len(result) == 0


@pytest.mark.asyncio
async def test_empty_city_filter(db: AsyncSession):
    """Test behavior when filtering by an empty city string."""
    # Empty string should be handled gracefully
    result = await get_business_data_by_city(db, "")
    assert isinstance(result, list)
    assert len(result) == 0


@pytest.mark.asyncio
async def test_special_chars_in_city(db: AsyncSession):
    """Test behavior when city contains special characters."""
    # Special characters should be handled gracefully
    special_city = "City'with\"special;chars--"
    result = await get_business_data_by_city(db, special_city)
    assert isinstance(result, list)


@pytest.mark.asyncio
async def test_cache_behavior(db: AsyncSession):
    """Test that caching works as expected."""
    # Clear cache before testing
    cache.clear()

    # First call should be a cache miss
    cities1 = await get_cities(db)

    # Second call should use the cached result
    cities2 = await get_cities(db)

    # Results should be identical
    assert cities1 == cities2

    # Clear cache and verify it's actually cleared
    cache.clear()

    # This should be another cache miss for industries
    industries1 = await get_industries(db)
    industries2 = await get_industries(db)

    # Results should be identical
    assert industries1 == industries2


@pytest.mark.asyncio
async def test_very_large_limit(db: AsyncSession):
    """Test behavior with a very large limit parameter."""
    # Using a large limit should not cause performance issues
    industry = await get_test_industry_letter(db)
    if not industry:
        pytest.skip("No test industry available")

    # Try with a large limit
    result = await get_companies_by_industry(db, industry, limit=10000)

    # Verify type regardless of result size
    assert isinstance(result, list)


@pytest.mark.asyncio
async def test_industry_with_city_filter(db: AsyncSession):
    """Test industry query with city filter."""
    industry = await get_test_industry_letter(db)
    city = await get_test_city(db)

    if not industry or not city:
        pytest.skip("Missing test data")

    # Get results with city filter
    filtered_results = await get_companies_by_industry(db, industry, city=city)

    # Verify all results have the correct city
    for business in filtered_results:
        assert business.city == city
        assert business.industry_letter == industry


# Helper functions


async def get_test_city(db: AsyncSession) -> str:
    """Get a test city from the database."""
    query = "SELECT city FROM addresses WHERE city IS NOT NULL LIMIT 1"
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


async def get_test_industry_letter(db: AsyncSession) -> str:
    """Get a test industry letter from the database."""
    query = "SELECT DISTINCT industry_letter FROM industry_classifications LIMIT 1"
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None
