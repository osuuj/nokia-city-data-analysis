"""Tests for analytics router endpoints."""

import asyncio

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from server.backend.main import app
from server.tests.utils.test_helpers import (
    create_test_session,
    get_test_cities,
    get_test_city,
    setup_test_dependencies,
    teardown_test_dependencies,
)

# Create test client
client = TestClient(app)


@pytest.mark.asyncio
async def test_get_industry_distribution(db: AsyncSession):
    """Test the GET /analytics/industry-distribution endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get a test city using a dedicated session to avoid concurrent operation issues
    async with create_test_session(db) as session:
        test_city = await get_test_city(session)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Wait a moment to ensure previous operation completes
    await asyncio.sleep(0.1)

    # Make request
    response = client.get(f"/api/v1/analytics/industry-distribution?city={test_city}")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200, f"Unexpected response: {response.text}"
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "name" in first_item
        assert "value" in first_item


@pytest.mark.asyncio
async def test_get_company_growth(db: AsyncSession):
    """Test the GET /analytics/industries-by-city endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get a test city using a dedicated session to avoid concurrent operation issues
    async with create_test_session(db) as session:
        test_city = await get_test_city(session)

    if not test_city:
        pytest.skip("No cities available for testing")

    # Wait a moment to ensure previous operation completes
    await asyncio.sleep(0.1)

    # Make request
    response = client.get(f"/api/v1/analytics/industries-by-city?cities={test_city}")

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200, f"Unexpected response: {response.text}"
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "city" in first_item


@pytest.mark.asyncio
async def test_get_industry_comparison(db: AsyncSession):
    """Test the GET /analytics/city-comparison endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get two test cities using a dedicated session
    async with create_test_session(db) as session:
        cities = await get_test_cities(session, 2)

    if len(cities) < 2:
        pytest.skip("Not enough cities available for testing")

    # Wait a moment to ensure previous operation completes
    await asyncio.sleep(0.1)

    # Make request
    response = client.get(
        f"/api/v1/analytics/city-comparison?cities={cities[0]},{cities[1]}"
    )

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200, f"Unexpected response: {response.text}"
    assert isinstance(response.json(), list)

    # If we have results, validate the structure
    if response.json():
        first_item = response.json()[0]
        assert "industry" in first_item


@pytest.mark.asyncio
async def test_industry_comparison_by_cities(db: AsyncSession):
    """Test the GET /analytics/industry_comparison_by_cities endpoint."""
    # Setup dependencies
    setup_test_dependencies(app, db)

    # Get two test cities using a dedicated session
    async with create_test_session(db) as session:
        cities = await get_test_cities(session, 2)

    if len(cities) < 2:
        pytest.skip("Not enough cities available for testing")

    # Wait a moment to ensure previous operation completes
    await asyncio.sleep(0.1)

    # Make request - using the correct endpoint path
    response = client.get(
        f"/api/v1/analytics/industry_comparison_by_cities?city1={cities[0]}&city2={cities[1]}"
    )

    # Remove the dependency override
    teardown_test_dependencies(app)

    # Validate response
    assert response.status_code == 200, f"Unexpected response: {response.text}"
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
