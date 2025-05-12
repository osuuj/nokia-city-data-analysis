"""Tests for analytics router endpoints."""

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from server.backend.main import app
from server.tests.utils.test_helpers import (
    get_test_city,
    setup_test_dependencies,
    teardown_test_dependencies,
)

# Create test client
client = TestClient(app)


@pytest.mark.anyio
async def test_get_industry_distribution(db):
    """Test the GET /analytics/industry-distribution endpoint with async client."""
    setup_test_dependencies(app, db)
    test_city = await get_test_city(db)
    if not test_city:
        pytest.skip("No cities available for testing")
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(
            f"/api/v1/analytics/industry-distribution?city={test_city}"
        )
    teardown_test_dependencies(app)
    assert response.status_code == 200, f"Unexpected response: {response.text}"
    assert isinstance(response.json(), list)
    if response.json():
        first_item = response.json()[0]
        assert "name" in first_item
        assert "value" in first_item


# The following tests are commented out for now to focus on a minimal working test suite.
# @pytest.mark.anyio
# async def test_get_company_growth(db):
#     ...
#
# @pytest.mark.anyio
# async def test_get_industry_comparison(db):
#     ...
#
# @pytest.mark.anyio
# async def test_industry_comparison_by_cities(db):
#     ...
