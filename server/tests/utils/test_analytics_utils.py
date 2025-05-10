"""Tests for analytics utility functions."""

import pytest

from server.backend.utils.analytics_utils import (
    filter_city_list,
    merge_data_by_category,
    normalize_percentage,
)


@pytest.mark.unit
def test_filter_city_list():
    """Test filtering city list from string."""
    # Test with valid input
    assert filter_city_list("Helsinki,Espoo, Tampere") == [
        "Helsinki",
        "Espoo",
        "Tampere",
    ]

    # Test with whitespace
    assert filter_city_list(" Helsinki , Espoo ") == ["Helsinki", "Espoo"]

    # Test with empty input
    assert filter_city_list("") == []
    assert filter_city_list(None) == []

    # Test with empty elements
    assert filter_city_list("Helsinki,,Espoo") == ["Helsinki", "Espoo"]


@pytest.mark.unit
def test_normalize_percentage():
    """Test normalizing values to percentages."""
    # Test normal cases
    assert normalize_percentage(25, 100) == 25
    assert normalize_percentage(1, 3) == 33

    # Test with decimal places
    assert normalize_percentage(1, 3, round_to=2) == 33.33

    # Test with zero or negative values
    assert normalize_percentage(0, 100) == 0
    assert normalize_percentage(25, 0) == 0  # Division by zero protection
    assert normalize_percentage(-25, 100) == -25


@pytest.mark.unit
def test_merge_data_by_category():
    """Test merging data into categories."""
    # Test data with various categories
    data = {
        "city1": {"A": 10, "B": 20, "C": 5, "D": 2},
        "city2": {"A": 5, "B": 15, "C": 10, "E": 3},
    }

    # Keep A and B separate, merge others into "Other"
    result = merge_data_by_category(data, {"A", "B"}, "Other")

    # Check structure is as expected
    assert "city1" in result
    assert "city2" in result

    # Check city1 data
    assert result["city1"]["A"] == 10
    assert result["city1"]["B"] == 20
    assert result["city1"]["Other"] == 7  # C + D
    assert len(result["city1"]) == 3  # A, B, Other

    # Check city2 data
    assert result["city2"]["A"] == 5
    assert result["city2"]["B"] == 15
    assert result["city2"]["Other"] == 13  # C + E
    assert len(result["city2"]) == 3  # A, B, Other

    # Test when no categories match
    result = merge_data_by_category(data, {"X", "Y"}, "Other")
    assert result["city1"]["Other"] == 37  # All merged
    assert result["city2"]["Other"] == 33  # All merged

    # Test with empty data
    assert merge_data_by_category({}, {"A", "B"}) == {}
