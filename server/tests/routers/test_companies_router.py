"""Tests for company router endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.database import get_db
from server.backend.main import app

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_get_cities(db: AsyncSession):
    """Test the GET /companies/cities endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test city to verify it appears in the response
    test_city = await get_test_city(db)

    # Make request
    response = client.get("/api/v1/companies/cities")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have a test city, verify it's in the response
    if test_city:
        assert test_city in response.json()


@pytest.mark.asyncio
async def test_get_industries(db: AsyncSession):
    """Test the GET /companies/industries endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test industry to verify it appears in the response
    test_industry = await get_test_industry_letter(db)

    # Make request
    response = client.get("/api/v1/companies/industries")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have a test industry, verify it's in the response
    if test_industry:
        assert test_industry in response.json()


@pytest.mark.asyncio
async def test_get_businesses_by_city(db: AsyncSession):
    """Test the GET /companies/businesses_by_city endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test city
    test_city = await get_test_city(db)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Make request
    response = client.get(f"/api/v1/companies/businesses_by_city?city={test_city}")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_business = response.json()[0]
        assert "business_id" in first_business
        assert "company_name" in first_business
        assert "city" in first_business
        assert first_business["city"] == test_city


@pytest.mark.asyncio
async def test_get_businesses_by_industry(db: AsyncSession):
    """Test the GET /companies/businesses_by_industry endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test industry
    test_industry = await get_test_industry_letter(db)

    if not test_industry:
        pytest.skip("No industries available for testing")

    # Make request
    response = client.get(
        f"/api/v1/companies/businesses_by_industry?industry_letter={test_industry}"
    )

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # Check that we respect the default limit
    assert len(response.json()) <= 100

    # If we have results, validate the structure
    if response.json():
        first_business = response.json()[0]
        assert "business_id" in first_business
        assert "company_name" in first_business
        assert "industry_letter" in first_business
        assert first_business["industry_letter"] == test_industry


# Helper functions


async def get_test_city(db: AsyncSession) -> str:
    """Get a city name for testing."""
    query = text("SELECT city FROM addresses WHERE city IS NOT NULL LIMIT 1")
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


async def get_test_industry_letter(db: AsyncSession) -> str:
    """Get an industry letter for testing."""
    query = text(
        "SELECT DISTINCT industry_letter FROM industry_classifications LIMIT 1"
    )
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None
