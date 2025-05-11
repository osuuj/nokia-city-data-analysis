"""Tests for company service functions."""

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.services.company_service import (
    get_business_data_by_city,
    get_cities,
    get_companies_by_industry,
    get_industries,
)


@pytest.mark.asyncio
async def test_get_business_data_by_city(db: AsyncSession):
    """Test retrieving business data by city using SQLAlchemy."""
    # Get a test city
    city = await get_test_city(db)

    if not city:
        pytest.skip("No cities available for testing")

    # Get data using SQLAlchemy implementation
    result = await get_business_data_by_city(db, city)

    # Basic validation
    assert isinstance(result, list)

    # If we have results, check the structure
    if result:
        # Check first record has expected fields
        first_record = result[0]
        assert first_record.business_id
        assert first_record.company_name
        assert first_record.city == city


@pytest.mark.asyncio
async def test_get_companies_by_industry(db: AsyncSession):
    """Test retrieving business data by industry."""
    # Get a test industry letter
    industry_letter = await get_test_industry_letter(db)

    if not industry_letter:
        pytest.skip("No industry letters available for testing")

    # Get data using the function
    result = await get_companies_by_industry(db, industry_letter, limit=5)

    # Basic validation
    assert isinstance(result, list)
    assert len(result) <= 5  # Respect the limit

    # If we have results, check the structure
    if result:
        # Check first record has expected fields
        first_record = result[0]
        assert first_record.business_id
        assert first_record.company_name
        assert first_record.industry_letter == industry_letter


@pytest.mark.asyncio
async def test_get_cities(db: AsyncSession):
    """Test retrieving all cities."""
    # Get cities using the function
    cities = await get_cities(db)

    # Basic validation
    assert isinstance(cities, list)

    # If we have results, check they're non-empty strings
    if cities:
        assert all(isinstance(city, str) for city in cities)
        assert all(len(city) > 0 for city in cities)


@pytest.mark.asyncio
async def test_get_industries(db: AsyncSession):
    """Test retrieving all industry letter codes."""
    # Get industry letters using the function
    industries = await get_industries(db)

    # Basic validation
    assert isinstance(industries, list)

    # If we have results, check they're non-empty strings
    if industries:
        assert all(isinstance(industry, str) for industry in industries)
        assert all(len(industry) > 0 for industry in industries)


# Helper functions for tests


async def get_test_city(db: AsyncSession) -> str:
    """Get a city name for testing."""
    query = "SELECT city FROM addresses WHERE city IS NOT NULL LIMIT 1"
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


async def get_test_industry_letter(db: AsyncSession) -> str:
    """Get an industry letter for testing."""
    query = "SELECT DISTINCT industry_letter FROM industry_classifications LIMIT 1"
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None
