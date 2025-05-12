"""Tests for edge cases and error handling in API routes."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.main import app
from server.tests.utils.test_helpers import (
    get_test_industry_letter,
    setup_test_dependencies,
    teardown_test_dependencies,
)

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_invalid_city_parameter(db: AsyncSession):
    """Test behavior when requesting data with an invalid city parameter."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Make request with invalid city
    response = client.get(
        "/api/v1/companies/businesses_by_city?city=NonExistentCity12345"
    )

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Should return 200 OK with empty list
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_invalid_industry_parameter(db: AsyncSession):
    """Test behavior when requesting data with an invalid industry parameter."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Make request with invalid industry
    response = client.get("/api/v1/companies/businesses_by_industry?industry_letter=ZZ")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Should return 200 OK with empty list
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_missing_required_parameter(db: AsyncSession):
    """Test behavior when a required parameter is missing."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Make request without required parameter
    response = client.get("/api/v1/companies/businesses_by_city")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Should return 422 Unprocessable Entity for validation error
    assert response.status_code == 422
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_invalid_limit_parameter(db: AsyncSession):
    """Test behavior when limit parameter is invalid."""
    # Setup dependencies
    setup_test_dependencies(app, db)

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
    teardown_test_dependencies(app)

    # Should return 422 Unprocessable Entity for validation error
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_health_endpoint(db: AsyncSession):
    """Test the health endpoint."""
    # No need for database dependency for this test
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
    # No need for database dependency for this test
    # Make request to old health endpoint
    response = client.get("/health", allow_redirects=False)

    # Should return 307 Temporary Redirect
    assert response.status_code == 307
    assert response.headers["location"] == "/api/health"
