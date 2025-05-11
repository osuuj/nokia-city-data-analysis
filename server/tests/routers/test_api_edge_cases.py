"""Tests for edge cases and error handling in API routes."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.database import get_db
from server.backend.main import app

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_invalid_city_parameter(db: AsyncSession):
    """Test behavior when requesting data with an invalid city parameter."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Make request with invalid city
    response = client.get(
        "/api/v1/companies/businesses_by_city?city=NonExistentCity12345"
    )

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Should return 200 OK with empty list
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_invalid_industry_parameter(db: AsyncSession):
    """Test behavior when requesting data with an invalid industry parameter."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Make request with invalid industry
    response = client.get("/api/v1/companies/businesses_by_industry?industry_letter=ZZ")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Should return 200 OK with empty list
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_missing_required_parameter(db: AsyncSession):
    """Test behavior when a required parameter is missing."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Make request without required parameter
    response = client.get("/api/v1/companies/businesses_by_city")

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Should return 422 Unprocessable Entity for validation error
    assert response.status_code == 422
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_invalid_limit_parameter(db: AsyncSession):
    """Test behavior when limit parameter is invalid."""

    # Override the dependency to use our test database
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    # Get a test industry
    test_industry = await get_test_industry_letter(db)

    if not test_industry:
        pytest.skip("No industries available for testing")

    # Make request with invalid limit (negative)
    response = client.get(
        f"/api/v1/companies/businesses_by_industry?industry_letter={test_industry}&limit=-1"
    )

    # Should return 422 Unprocessable Entity for validation error
    assert response.status_code == 422

    # Make request with invalid limit (too large)
    response = client.get(
        f"/api/v1/companies/businesses_by_industry?industry_letter={test_industry}&limit=1000"
    )

    # Remove the dependency override
    app.dependency_overrides.clear()

    # Should return 422 Unprocessable Entity for validation error
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_health_endpoint(db: AsyncSession):
    """Test the health endpoint."""
    # Make request to health endpoint
    response = client.get("/api/health")

    # Should return 200 OK
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "timestamp" in response.json()
    assert "version" in response.json()
    assert "environment" in response.json()


@pytest.mark.asyncio
async def test_health_redirect(db: AsyncSession):
    """Test the health endpoint redirect."""
    # Make request to old health endpoint
    response = client.get("/health", allow_redirects=False)

    # Should return 307 Temporary Redirect
    assert response.status_code == 307
    assert response.headers["location"] == "/api/health"


# Helper functions


async def get_test_industry_letter(db: AsyncSession) -> str:
    """Get a test industry letter from the database."""
    query = text(
        "SELECT DISTINCT industry_letter FROM industry_classifications LIMIT 1"
    )
    result = await db.execute(query)
    row = result.first()
    return row[0] if row else None
