"""Analytics service module.

This module provides data analytics services for business data including:
- Industry distribution analysis
- City comparison statistics
- Top cities analysis
"""

import logging
from collections import defaultdict
from typing import Dict, List, Optional, Set, TypedDict, Union

from sqlalchemy import distinct, func, select
from sqlalchemy.engine.row import Row
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..models.company import Address, Company, IndustryClassification

# Configure logger
logger = logging.getLogger(__name__)

# Import central configuration constants
PRIORITY_INDUSTRY_LETTERS = settings.ANALYTICS_PRIORITY_INDUSTRIES
OTHER_CATEGORY_NAME = settings.ANALYTICS_OTHER_CATEGORY_NAME
TOP_N_INDUSTRIES = settings.ANALYTICS_TOP_N_INDUSTRIES


# Type definitions for improved type safety
class IndustryBreakdownItem(TypedDict):
    """Industry breakdown item with name and value."""

    name: str
    value: int


class IndustryDistributionItem(TypedDict):
    """Industry distribution item with name, value, and optional breakdown."""

    name: str
    value: int
    industry_description: str
    industry_letter: str
    count: int
    percentage: float
    others_breakdown: Optional[List[IndustryBreakdownItem]]


class CityComparisonItem(TypedDict):
    """City comparison item with industry and city percentages."""

    industry: str
    # Plus dynamically added city keys with percentages


class IndustryByCityItem(TypedDict):
    """Industry by city item with city and industry counts."""

    city: str
    # Plus dynamically added industry keys with counts


class TopCityItem(TypedDict):
    """Top city item with city name and company count."""

    city: str
    count: int


# Constants
PRIORITY_INDUSTRY_LETTERS: Set[str] = {
    "K",  # IT
    "L",  # Finance
    "R",  # Healthcare
    "G",  # Retail
    "C",  # Manufacturing
    "Q",  # Education
}
OTHER_CATEGORY_NAME = "Other"
TOP_N_INDUSTRIES = 10  # Number of top industries to show explicitly

# --- Helper Functions ---


async def get_top_n_industry_letters(
    db: AsyncSession, city_list: Optional[List[str]] = None
) -> Set[str]:
    """Gets the letters of the top N most frequent industries overall or for specific cities.

    Args:
        db: Database async session
        city_list: Optional list of cities to filter by

    Returns:
        Set of industry letter codes for the top N industries
    """
    if city_list is None:
        city_list = []

    stmt = (
        select(
            IndustryClassification.industry_letter,
            func.count(distinct(Company.business_id)).label("count"),
        )
        .join(
            IndustryClassification,
            Company.business_id == IndustryClassification.business_id,
        )
        .where(IndustryClassification.industry_letter.is_not(None))
        .group_by(IndustryClassification.industry_letter)
        .order_by(func.count(distinct(Company.business_id)).desc())
        .limit(TOP_N_INDUSTRIES)
    )

    if city_list:
        stmt = stmt.join(Address, Company.business_id == Address.business_id)
        stmt = stmt.where(Address.city.in_(city_list))

    try:
        results = await db.execute(stmt)
        return {row.industry_letter for row in results.all()}
    except Exception as e:
        logger.error(f"Error getting top industry letters: {e}")
        return set()


def group_data_for_distribution(
    results: List[Row], top_letters: Set[str]
) -> List[IndustryDistributionItem]:  # pyright: ignore[reportReturnType]
    """Groups raw industry letter counts into Top N + Other, providing breakdown.

    Args:
        results: Query results with industry_letter and count fields
        top_letters: Set of industry letters considered to be in the top group

    Returns:
        List of distribution items with name, value, and optional breakdown
    """
    top_data: List[IndustryDistributionItem] = []
    other_value = 0
    other_details: List[IndustryBreakdownItem] = []  # Store details for breakdown

    for row in results:
        if row.industry_letter in top_letters:
            # Calculate the percentage later when we know total
            item: IndustryDistributionItem = {
                "name": row.industry_letter,
                "value": row.count,
                "industry_letter": row.industry_letter,
                "industry_description": getattr(row, "industry_description", ""),
                "count": row.count,
                "percentage": 0.0,  # Will be set later
                "others_breakdown": None,
            }
            top_data.append(item)
        else:
            other_value += row.count  # pyright: ignore[reportOperatorIssue]
            # Store individual item for breakdown
            other_details.append(
                {
                    "name": row.industry_letter,
                    "value": row.count,
                }
            )  # pyright: ignore[reportArgumentType]

    # Calculate total for percentages
    total_count = sum(item["value"] for item in top_data) + other_value
    if total_count > 0:
        # Update percentages
        for item in top_data:
            item["percentage"] = round((item["value"] / total_count) * 100, 1)

    if other_value > 0:
        # Sort the breakdown details by count descending
        other_details.sort(key=lambda x: x["value"], reverse=True)
        # Add the aggregated "Other" item with its breakdown
        other_item: IndustryDistributionItem = {
            "name": OTHER_CATEGORY_NAME,
            "value": other_value,
            "industry_letter": OTHER_CATEGORY_NAME,
            "industry_description": "Other industries",
            "count": other_value,
            "percentage": (
                round((other_value / total_count) * 100, 1) if total_count > 0 else 0.0
            ),
            "others_breakdown": other_details,
        }
        top_data.append(other_item)

    # Sort final list by value descending
    top_data.sort(key=lambda x: x["value"], reverse=True)
    return top_data


def pivot_and_group_data(
    results: List[Row],
    top_letters: Set[str],
    group_by_key: str,
    pivot_key: str,
    value_key: str,
    all_groups: List[str],
    normalize: bool = False,
) -> List[Dict[str, Union[str, int, float]]]:  # pyright: ignore[reportReturnType]
    """Pivots data and groups non-priority items into 'Other', optionally normalizing values.

    Args:
        results: Query results
        top_letters: Set of industry letters considered to be in the top group
        group_by_key: Name of the field to group by (e.g., "city")
        pivot_key: Name of the field to pivot on (e.g., "industry")
        value_key: Name of the value field (e.g., "count")
        all_groups: All possible values for group_by_key
        normalize: Whether to normalize values as percentages

    Returns:
        List of dictionaries with pivoted data
    """
    temp_pivoted_data: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
    group_totals: Optional[Dict[str, int]] = defaultdict(int) if normalize else None

    # Initial aggregation & calculate totals if normalizing
    for row in results:
        group_val = getattr(row, group_by_key)
        pivot_val = getattr(row, pivot_key)  # This is the industry letter
        count = getattr(row, value_key)

        if group_val and pivot_val:
            category = pivot_val if pivot_val in top_letters else OTHER_CATEGORY_NAME
            temp_pivoted_data[group_val][category] += count
            if normalize and group_totals is not None:
                group_totals[group_val] += count  # Sum counts per group

    # Format into the final list structure
    final_data: List[Dict[str, Union[str, int, float]]] = []
    all_pivot_keys = sorted(list(top_letters)) + (
        [OTHER_CATEGORY_NAME]
        if any(OTHER_CATEGORY_NAME in d for d in temp_pivoted_data.values())
        else []
    )

    for group_val in all_groups:
        data_entry: Dict[str, Union[str, int, float]] = {group_by_key: group_val}
        group_total = (
            group_totals.get(group_val, 1) if normalize and group_totals else 1
        )  # Avoid division by zero
        if group_total == 0:
            group_total = 1  # Avoid division by zero

        for pivot_val in all_pivot_keys:
            raw_value = temp_pivoted_data[group_val].get(pivot_val, 0)
            # Normalize to percentage if requested, otherwise use raw count
            data_entry[pivot_val] = (
                round((raw_value / group_total) * 100, 1) if normalize else raw_value
            )
        final_data.append(data_entry)

    return final_data


# --- Analytics Service Functions ---


async def get_industry_distribution(
    db: AsyncSession,
    cities: Optional[List[str]] = None,
) -> List[IndustryDistributionItem]:  # pyright: ignore[reportReturnType]
    """Get industry distribution with breakdown of 'Other' category.

    Args:
        db: Database async session
        cities: Optional list of cities to filter by

    Returns:
        List of industry distribution items with breakdown
    """
    city_list = cities or []

    try:
        top_letters = await get_top_n_industry_letters(db, city_list)

        stmt = (
            select(
                IndustryClassification.industry_letter,
                IndustryClassification.industry_description,
                func.count(distinct(Company.business_id)).label("count"),
            )
            .join(
                IndustryClassification,
                Company.business_id == IndustryClassification.business_id,
            )
            .where(IndustryClassification.industry_letter.is_not(None))
            .group_by(
                IndustryClassification.industry_letter,
                IndustryClassification.industry_description,
            )
        )

        if city_list:
            stmt = stmt.join(Address, Company.business_id == Address.business_id)
            stmt = stmt.where(Address.city.in_(city_list))

        results = await db.execute(stmt)
        return group_data_for_distribution(
            results.all(), top_letters
        )  # pyright: ignore[reportArgumentType]

    except Exception as e:
        logger.error(f"Error getting industry distribution: {e}")
        raise


async def get_city_comparison(
    db: AsyncSession,
    cities: List[str],
) -> List[Dict[str, Union[str, int, float]]]:  # pyright: ignore[reportReturnType]
    """Compare normalized industry distribution across cities.

    Args:
        db: Database async session
        cities: List of cities to compare

    Returns:
        List of dictionaries with city comparison data
    """
    if not cities:
        logger.error("No cities provided for city comparison")
        return []

    try:
        # Find top letters based on the selected cities
        top_letters = await get_top_n_industry_letters(db, cities)

        stmt = (
            select(
                IndustryClassification.industry_letter.label("industry"),  # pivot_key
                Address.city,  # group_by_key -> becomes column header
                func.count(distinct(Company.business_id)).label("count"),  # value_key
            )
            .select_from(Company)
            .join(Address, Company.business_id == Address.business_id)
            .join(
                IndustryClassification,
                Company.business_id == IndustryClassification.business_id,
            )
            .where(Address.city.in_(cities))
            .where(IndustryClassification.industry_letter.is_not(None))
            .group_by(IndustryClassification.industry_letter, Address.city)
        )

        results = await db.execute(stmt)
        all_results = results.all()

        # Pivot data for the Radar chart format: { industry: 'A', City1: %, City2: % }
        # We need to normalize *within* each city first
        city_totals: Dict[str, int] = defaultdict(int)
        raw_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
        all_industries_in_results: Set[str] = set()

        for row in all_results:
            if row.industry and row.city in cities:
                city_totals[row.city] += row.count
                raw_counts[row.industry][row.city] = row.count
                all_industries_in_results.add(row.industry)

        # Group into top N + Other based on overall counts
        final_pivot: Dict[str, Dict[str, int]] = defaultdict(
            lambda: {city: 0 for city in cities}
        )
        for industry_letter in all_industries_in_results:
            category = (
                industry_letter
                if industry_letter in top_letters
                else OTHER_CATEGORY_NAME
            )
            for city in cities:
                final_pivot[category][city] += raw_counts[industry_letter].get(city, 0)

        # Format and Normalize
        final_data: List[Dict[str, Union[str, int, float]]] = []
        for category in sorted(list(final_pivot.keys())):
            data_entry: Dict[str, Union[str, int, float]] = {
                "industry": category
            }  # Category is Letter or 'Other'
            for city in cities:
                total = city_totals.get(city, 1)
                if total == 0:
                    total = 1  # Avoid division by zero
                data_entry[city] = round(
                    (final_pivot[category].get(city, 0) / total) * 100, 1
                )
            final_data.append(data_entry)

        return final_data

    except Exception as e:
        logger.error(f"Error fetching city comparison data: {e}")
        raise


async def get_industries_by_city(
    db: AsyncSession,
    cities: List[str],
) -> List[Dict[str, Union[str, int]]]:  # pyright: ignore[reportReturnType]
    """Get Top 10 + Other industry counts for each city.

    Args:
        db: Database async session
        cities: List of cities to analyze

    Returns:
        List of dictionaries with industry counts by city
    """
    if not cities:
        logger.error("No cities provided for industries by city")
        return []

    try:
        # Find top letters based on the selected cities
        top_letters = await get_top_n_industry_letters(db, cities)

        stmt = (
            select(
                Address.city,  # group_by_key
                IndustryClassification.industry_letter.label("industry"),  # pivot_key
                func.count(distinct(Company.business_id)).label("count"),  # value_key
            )
            .select_from(Company)
            .join(Address, Company.business_id == Address.business_id)
            .join(
                IndustryClassification,
                Company.business_id == IndustryClassification.business_id,
            )
            .where(Address.city.in_(cities))
            .where(IndustryClassification.industry_letter.is_not(None))
            .group_by(Address.city, IndustryClassification.industry_letter)
        )

        results = await db.execute(stmt)

        # Use the generic pivot helper, don't normalize counts
        return pivot_and_group_data(
            results=results.all(),
            top_letters=top_letters,
            group_by_key="city",
            pivot_key="industry",
            value_key="count",
            all_groups=cities,
            normalize=False,
        )

    except Exception as e:
        logger.error(f"Error fetching industries by city data: {e}")
        raise


async def get_top_cities(
    db: AsyncSession,
    limit: int = 10,
) -> List[TopCityItem]:  # pyright: ignore[reportReturnType]
    """Get top cities by active company count.

    Args:
        db: Database async session
        limit: Maximum number of cities to return

    Returns:
        List of top cities with company counts
    """
    try:
        # Select city, COUNT(DISTINCT active company business_id)
        stmt = (
            select(
                Address.city, func.count(distinct(Company.business_id)).label("count")
            )
            .select_from(Address)
            .join(Company, Address.business_id == Company.business_id)
            .where(Address.city.is_not(None))
            .where(Company.active.is_(True))  # Filter for active companies
            .group_by(Address.city)
            .order_by(func.count(distinct(Company.business_id)).desc())
            .limit(limit)
        )

        results = await db.execute(stmt)
        all_results = results.all()

        return [
            {"city": row.city, "count": row.count} for row in all_results
        ]  # pyright: ignore[reportAssignmentType]

    except Exception as e:
        logger.error(f"Error getting top cities: {e}")
        raise
