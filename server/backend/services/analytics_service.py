"""Analytics service module.

This module provides data analytics services for business data including:
- Industry distribution analysis
- City comparison statistics
- Top cities analysis
"""

import logging
from collections import defaultdict
from typing import Dict, List, Optional, Set, Tuple, TypedDict, Union

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


def _aggregate_industry_data(
    results: List[Row],
) -> Tuple[Dict[str, int], Dict[str, str]]:
    """Aggregate industry data by letter and collect descriptions.

    Args:
        results: Query results with industry data

    Returns:
        Tuple of (industry_totals, industry_descriptions)
    """
    totals = {}
    descriptions = {}

    for row in results:
        letter = row.industry_letter
        if not letter:
            continue

        # Keep track of descriptions
        if hasattr(row, "industry_description"):
            if letter not in descriptions:
                descriptions[letter] = getattr(row, "industry_description", "")
        else:
            # If description not available, use a default
            descriptions[letter] = f"Industry {letter}"

        # Sum the counts
        if letter in totals:
            totals[letter] += row.count
        else:
            totals[letter] = row.count

    return totals, descriptions


def _process_top_industries(
    industry_totals: Dict[str, int],
    industry_descriptions: Dict[str, str],
    top_letters: Set[str],
) -> Tuple[List[IndustryDistributionItem], int, List[IndustryBreakdownItem]]:
    """Process industry data into top industries and others.

    Args:
        industry_totals: Dictionary of industry letter to count
        industry_descriptions: Dictionary of industry letter to description
        top_letters: Set of industry letters to be treated as top

    Returns:
        Tuple of (top_data, other_value, other_details)
    """
    # Initialize data structures
    top_data = []
    other_value = 0
    other_details = []
    processed_letters = set()

    # Process the aggregated data
    for industry_letter, total_count in industry_totals.items():
        if industry_letter in top_letters and industry_letter not in processed_letters:
            # Add to top data
            processed_letters.add(industry_letter)
            top_data.append(
                {
                    "name": industry_letter,
                    "value": total_count,
                    "industry_letter": industry_letter,
                    "industry_description": industry_descriptions.get(
                        industry_letter, ""
                    ),
                    "count": total_count,
                    "percentage": 0.0,  # Will be set later
                    "others_breakdown": None,
                }
            )
        else:
            # Add to other
            other_value += total_count
            other_details.append(
                {
                    "name": industry_letter,
                    "value": total_count,
                }
            )

    return top_data, other_value, other_details


def _create_other_category(
    other_details: List[IndustryBreakdownItem], other_value: int, total_count: int
) -> IndustryDistributionItem:
    """Create the 'Other' category with breakdown details.

    Args:
        other_details: List of breakdown items
        other_value: Total value for 'Other' category
        total_count: Total count for percentage calculation

    Returns:
        'Other' category item
    """
    # Sort the breakdown details by count descending
    other_details.sort(key=lambda x: x["value"], reverse=True)

    # Create the 'Other' item with its breakdown
    return {
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


def _update_percentages(data: List[IndustryDistributionItem], total_count: int) -> None:
    """Update percentage values for each item in data.

    Args:
        data: List of distribution items to update
        total_count: Total count for percentage calculation
    """
    if total_count > 0:
        for item in data:
            item["percentage"] = round((item["value"] / total_count) * 100, 1)


def group_data_for_distribution(
    results: List[Row], top_letters: Set[str]
) -> List[IndustryDistributionItem]:
    """Groups raw industry letter counts into Top N + Other, providing breakdown.

    Args:
        results: Query results with industry_letter and count fields
        top_letters: Set of industry letters considered to be in the top group

    Returns:
        List of distribution items with name, value, and optional breakdown
    """
    # Step 1: Aggregate data
    industry_totals, industry_descriptions = _aggregate_industry_data(results)

    # Step 2: Process into top and other categories
    top_data, other_value, other_details = _process_top_industries(
        industry_totals, industry_descriptions, top_letters
    )

    # Step 3: Calculate total for percentages
    total_count = sum(item["value"] for item in top_data) + other_value

    # Step 4: Update percentages for top data
    _update_percentages(top_data, total_count)

    # Step 5: Add the 'Other' category if needed
    if other_value > 0:
        other_item = _create_other_category(other_details, other_value, total_count)
        top_data.append(other_item)

    # Step 6: Sort final list by value descending
    top_data.sort(key=lambda x: x["value"], reverse=True)

    # Log for debugging
    logger.debug(f"Final distribution data has {len(top_data)} items")

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
    """Calculates the distribution of businesses across different industries.

    Args:
        db: Database session
        cities: Optional list of city names to filter by

    Returns:
        List of industry distribution items with breakdown data
    """
    try:
        top_letters = await get_top_n_industry_letters(db, cities)

        # Add the PRIORITY_INDUSTRY_LETTERS to the top_letters set
        for letter in PRIORITY_INDUSTRY_LETTERS:
            top_letters.add(letter)

        logger.debug(f"Top industry letters: {top_letters}")

        # Build query for industry distribution
        # Check both possible field names - the issue might be with the description field name
        try:
            stmt = (
                select(
                    IndustryClassification.industry_letter,
                    func.count(distinct(Company.business_id)).label("count"),
                    # Try using the column name directly
                    IndustryClassification.industry_description.label(
                        "industry_description"
                    ),
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

            if cities:
                stmt = stmt.join(Address, Company.business_id == Address.business_id)
                stmt = stmt.where(Address.city.in_(cities))

            results = await db.execute(stmt)
            rows = results.all()

            # If we got results, proceed with them
            if rows:
                logger.debug(
                    f"Retrieved {len(rows)} industry rows with industry_description field"
                )
            else:
                # If no results, maybe a different field name
                raise AttributeError(
                    "No results or wrong field name - trying alternative"
                )

        except (AttributeError, Exception) as e:
            # Fallback to just getting the letter without the description
            logger.warning(
                f"Error with description field, trying simpler query: {str(e)}"
            )
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
            )

            if cities:
                stmt = stmt.join(Address, Company.business_id == Address.business_id)
                stmt = stmt.where(Address.city.in_(cities))

            results = await db.execute(stmt)
            rows = results.all()
            logger.debug(f"Retrieved {len(rows)} industry rows with simpler query")

        # Log a sample of the data
        if rows:
            sample = rows[0]
            logger.debug(f"First row sample: {sample}")

        # Group raw query results into Top N + Others with breakdown
        distribution_data = group_data_for_distribution(rows, top_letters)

        logger.debug(f"Distribution data type: {type(distribution_data)}")
        logger.debug(f"Distribution data length: {len(distribution_data)}")

        return distribution_data
    except Exception as e:
        logger.error(f"Error getting industry distribution: {e}", exc_info=True)
        # Re-raise so the endpoint can handle the error
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


class IndustryComparisonResult(TypedDict):
    """Industry comparison between two cities result."""

    industry_letter: str
    industry_description: str
    city1_count: int
    city2_count: int
    city1_percentage: float
    city2_percentage: float
    difference: float


async def compare_industry_by_cities(
    db: AsyncSession,
    city1: str,
    city2: str,
) -> List[IndustryComparisonResult]:
    """Compare industry distribution between two cities.

    Args:
        db: Database async session
        city1: First city to compare
        city2: Second city to compare

    Returns:
        List of industry comparison results
    """
    try:
        # Get industry distribution for both cities
        city1_data = await get_industry_distribution(db, [city1])
        city2_data = await get_industry_distribution(db, [city2])

        # Create a mapping of industry letter to result
        results = []

        # Create mapping for quick lookup
        city1_map = {item["industry_letter"]: item for item in city1_data}
        city2_map = {item["industry_letter"]: item for item in city2_data}

        # Combine all industry letters from both cities
        all_industries = set(city1_map.keys()).union(set(city2_map.keys()))

        for industry in all_industries:
            # Get data for this industry in both cities, defaulting to 0 if not present
            city1_item = city1_map.get(
                industry, {"count": 0, "percentage": 0, "industry_description": ""}
            )
            city2_item = city2_map.get(
                industry, {"count": 0, "percentage": 0, "industry_description": ""}
            )

            # Use description from whichever city has it
            industry_description = (
                city1_item.get("industry_description")
                or city2_item.get("industry_description")
                or ""
            )

            # Calculate percentage difference
            city1_percentage = float(city1_item.get("percentage", 0))
            city2_percentage = float(city2_item.get("percentage", 0))
            difference = city2_percentage - city1_percentage

            results.append(
                {
                    "industry_letter": str(industry),
                    "industry_description": str(industry_description),
                    "city1_count": int(city1_item.get("count", 0)),
                    "city2_count": int(city2_item.get("count", 0)),
                    "city1_percentage": city1_percentage,
                    "city2_percentage": city2_percentage,
                    "difference": difference,
                }
            )

        # Sort by absolute difference (descending)
        results.sort(key=lambda x: abs(x["difference"]), reverse=True)

        return results
    except Exception as e:
        logger.error(f"Error comparing industries: {e}")
        raise
