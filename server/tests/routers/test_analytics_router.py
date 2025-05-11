"""Tests for analytics router endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.database import get_db
from server.backend.main import app

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_get_industry_distribution(db: AsyncSession):
    """Test the GET /analytics/industry_distribution endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test city
    test_city = await get_test_city(db)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Make request
    response = client.get(f"/api/analytics/industry_distribution?city={test_city}")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "industry_letter" in first_item
        assert "count" in first_item
        assert "percentage" in first_item
        assert "industry_description" in first_item


@pytest.mark.asyncio
async def test_get_company_growth(db: AsyncSession):
    """Test the GET /analytics/company_growth endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test city
    test_city = await get_test_city(db)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Make request
    response = client.get(f"/api/analytics/company_growth?city={test_city}")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "year" in first_item
        assert "company_count" in first_item


@pytest.mark.asyncio
async def test_get_industry_comparison(db: AsyncSession):
    """Test the GET /analytics/industry_comparison endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get two test cities
    cities = await get_test_cities(db, 2)

    if len(cities) < 2:
        pytest.skip("Not enough cities available for testing")

    # Make request
    response = client.get(
        f"/api/analytics/industry_comparison?city1={cities[0]}&city2={cities[1]}"
    )

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "industry_letter" in first_item
        assert "industry_description" in first_item
        assert "city1_count" in first_item
        assert "city2_count" in first_item
        assert "city1_percentage" in first_item
        assert "city2_percentage" in first_item
        assert "difference" in first_item


@pytest.mark.asyncio
async def test_industry_comparison_by_cities(db: AsyncSession):
    """Test the GET /analytics/industry_comparison_by_cities endpoint."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get two test cities
    cities = await get_test_cities(db, 2)

    if len(cities) < 2:
        pytest.skip("Not enough cities available for testing")

    # Make request
    response = client.get(
        f"/api/analytics/industry_comparison_by_cities?city1={cities[0]}&city2={cities[1]}"
    )

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "industry_letter" in first_item
        assert "industry_description" in first_item
        assert "city1_count" in first_item
        assert "city2_count" in first_item
        assert "city1_percentage" in first_item
        assert "city2_percentage" in first_item
        assert "difference" in first_item

        # Check that results are sorted by difference magnitude (greatest first)
        if len(response.json()) > 1:
            assert abs(response.json()[0]["difference"]) >= abs(
                response.json()[1]["difference"]
            )


# Helper functions


async def get_test_city(db: AsyncSession) -> str:
    """Get a city name for testing."""
    query = text("SELECT city FROM addresses WHERE city IS NOT NULL LIMIT 1")
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None


async def get_test_cities(db: AsyncSession, count: int = 2) -> list:
    """Get multiple city names for testing."""
    query = text(
        "SELECT DISTINCT city FROM addresses WHERE city IS NOT NULL LIMIT :count"
    )
    result = await db.execute(query, {"count": count})
    rows = result.fetchall()
    return [row[0] for row in rows] if rows else []
