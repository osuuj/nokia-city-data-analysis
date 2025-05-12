"""Tests for company router endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.main import app
from server.tests.utils.test_helpers import (
    get_test_city,
    get_test_industry_letter,
    setup_test_dependencies,
    teardown_test_dependencies,
)

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_get_cities(db: AsyncSession):
    """Test the GET /companies/cities endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get a test city to verify it appears in the response
    test_city = await get_test_city(db)

    # Make request
    response = client.get("/api/v1/companies/cities")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
    # Check that our test city is in the response
    if test_city:
        assert test_city in response.json()


@pytest.mark.asyncio
async def test_get_industries(db: AsyncSession):
    """Test the GET /companies/industries endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Make request
    response = client.get("/api/v1/companies/industries")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_get_businesses_by_city(db: AsyncSession):
    """Test the GET /companies/businesses_by_city endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get a test city
    test_city = await get_test_city(db)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Make request
    response = client.get(f"/api/v1/companies/businesses_by_city?city={test_city}")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_businesses_by_industry(db: AsyncSession):
    """Test the GET /companies/businesses_by_industry endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get a test industry
    test_industry = await get_test_industry_letter(db)

    if not test_industry:
        pytest.skip("No industries available for testing")

    # Make request
    response = client.get(
        f"/api/v1/companies/businesses_by_industry?industry_letter={test_industry}"
    )

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200
    assert isinstance(response.json(), list)
