"""Utility functions for analytics operations.

This module provides reusable helper functions for transforming, filtering
and calculating analytics data.
"""

from collections import defaultdict
from typing import Dict, List, Set


def filter_city_list(city_param: str) -> List[str]:
    """Parse and filter a comma-separated list of cities.

    Args:
        city_param: Comma-separated string of city names

    Returns:
        List of non-empty city names
    """
    if not city_param:
        return []

    return [city.strip() for city in city_param.split(",") if city.strip()]


def normalize_percentage(value: float, total: float, round_to: int = 0) -> float:
    """Normalize a value as a percentage of the total.

    Args:
        value: The value to normalize
        total: The total value
        round_to: Number of decimal places to round to (default: 0)

    Returns:
        Normalized percentage value
    """
    if total <= 0:
        return 0.0

    percentage = (value / total) * 100
    return round(percentage, round_to)


def merge_data_by_category(
    data: Dict[str, Dict[str, float]],
    categories: Set[str],
    other_category: str = "Other",
) -> Dict[str, Dict[str, float]]:
    """Merge data into specified categories, grouping the rest into 'Other'.

    Args:
        data: Nested dictionary of data
        categories: Set of categories to keep separate
        other_category: Name for the combined 'Other' category

    Returns:
        Dictionary with data merged into specified categories + 'Other'
    """
    result = defaultdict(lambda: defaultdict(float))

    # Find all inner keys
    all_inner_keys = set()
    for outer_key, inner_dict in data.items():
        all_inner_keys.update(inner_dict.keys())

    # Process each outer key
    for outer_key, inner_dict in data.items():
        # Handle categories to keep separate
        for category in categories:
            if category in inner_dict:
                result[outer_key][category] = inner_dict[category]

        # Merge remaining categories into 'Other'
        other_sum = 0
        for inner_key, value in inner_dict.items():
            if inner_key not in categories:
                other_sum += value

        # Only add 'Other' if it has a value
        if other_sum > 0:
            result[outer_key][other_category] = other_sum

    # Convert defaultdict to regular dict before returning
    return {k: dict(v) for k, v in result.items()}
