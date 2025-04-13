from collections import defaultdict
from typing import Any, Dict, List, Optional, Set, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import distinct, func, select
from sqlalchemy.orm import Session

# Adjust these imports based on your actual project structure
from ..database import get_db
from ..models.company import (  # Import from company.py
    Address,
    Company,
    MainBusinessLine,
)

# from ..services import analytics_service # Placeholder for a potential service layer

router = APIRouter()

# --- Pydantic Schemas specific to Analytics ---


# Based on client/components/features/analytics/data/mock-data.ts -> IndustryDistributionData
class IndustryDistributionItem(BaseModel):
    name: str  # Will hold industry_letter or 'Other'
    value: int

    class Config:
        """Pydantic model configuration."""

        orm_mode = True


# New model for detailed response
class IndustryDistributionDetailItem(IndustryDistributionItem):
    others_breakdown: Optional[List[IndustryDistributionItem]] = (
        None  # Add breakdown field
    )


# Based on client/... -> CityComparisonData
class CityComparisonItem(BaseModel):
    industry: str
    # Dynamically add cities as keys, e.g., Helsinki: int, Espoo: int
    # This might be better handled by structuring the response differently if Pydantic struggles
    # Or potentially using Dict[str, int] if cities are not fixed
    # For simplicity, let's assume a fixed structure or handle transformation later

    class Config:
        """Pydantic model configuration."""

        orm_mode = True


# Based on client/... -> IndustriesByCityData
class IndustriesByCityItem(BaseModel):
    city: str
    # Similar to CityComparison, dynamic keys for industries
    # Example: Technology: int, Finance: int

    class Config:
        """Pydantic model configuration."""

        orm_mode = True


# Based on client/... -> TopCityData
class TopCityItem(BaseModel):
    city: str
    count: int  # Represents active company count

    class Config:
        """Pydantic model configuration."""

        orm_mode = True


# --- Constants ---
# Define the priority industry letters based on the target image
PRIORITY_INDUSTRY_LETTERS: Set[str] = {
    "K",
    "L",
    "R",
    "G",
    "C",
    "Q",
}  # IT, Finance, Healthcare, Retail, Manufacturing, Education
OTHER_CATEGORY_NAME = "Other"
TOP_N_INDUSTRIES = 10  # Number of top industries to show explicitly

# --- Helper Functions ---


def get_top_n_industry_letters(db: Session, city_list: List[str] = []) -> Set[str]:
    """Gets the letters of the top N most frequent industries overall or for specific cities."""
    stmt = (
        select(
            MainBusinessLine.industry_letter,
            func.count(distinct(Company.business_id)).label("count"),
        )
        .join(MainBusinessLine, Company.business_id == MainBusinessLine.business_id)
        .where(MainBusinessLine.industry_letter is not None)
        .group_by(MainBusinessLine.industry_letter)
        .order_by(func.count(distinct(Company.business_id)).desc())
        .limit(TOP_N_INDUSTRIES)
    )
    if city_list:
        stmt = stmt.join(Address, Company.business_id == Address.business_id)
        stmt = stmt.where(Address.city.in_(city_list))

    results = db.execute(stmt).all()
    return {row.industry_letter for row in results}


def group_data_for_distribution(
    results: List[Any], top_letters: Set[str]
) -> List[IndustryDistributionDetailItem]:
    """Groups raw industry letter counts into Top N + Other, providing breakdown."""
    top_data = []
    other_value = 0
    other_details: List[IndustryDistributionItem] = []  # Store details for breakdown

    for row in results:
        if row.industry_letter in top_letters:
            # Cast to DetailItem, breakdown will be None
            top_data.append(
                IndustryDistributionDetailItem(
                    name=row.industry_letter, value=row.count
                )
            )
        else:
            other_value += row.count
            # Store individual item for breakdown
            other_details.append(
                IndustryDistributionItem(name=row.industry_letter, value=row.count)
            )

    if other_value > 0:
        # Sort the breakdown details by count descending
        other_details.sort(key=lambda x: x.value, reverse=True)
        # Add the aggregated "Other" item with its breakdown
        top_data.append(
            IndustryDistributionDetailItem(
                name=OTHER_CATEGORY_NAME,
                value=other_value,
                others_breakdown=other_details,  # Assign breakdown
            )
        )

    # Sort final list, usually putting 'Other' last if needed, but sorting by value is common
    top_data.sort(key=lambda x: x.value, reverse=True)
    return top_data


def pivot_and_group_data(
    results: List[Any],
    top_letters: Set[str],
    group_by_key: str,
    pivot_key: str,
    value_key: str,
    all_groups: List[str],
    normalize: bool = False,
) -> List[Dict[str, Any]]:
    """Pivots data and groups non-priority items into 'Other', optionally normalizing values."""
    temp_pivoted_data = defaultdict(lambda: defaultdict(int))
    group_totals = defaultdict(int) if normalize else None

    # Initial aggregation & calculate totals if normalizing
    for row in results:
        group_val = getattr(row, group_by_key)
        pivot_val = getattr(row, pivot_key)  # This is the industry letter
        count = getattr(row, value_key)

        if group_val and pivot_val:
            category = pivot_val if pivot_val in top_letters else OTHER_CATEGORY_NAME
            temp_pivoted_data[group_val][category] += count
            if normalize and group_totals is not None:
                group_totals[
                    group_val
                ] += count  # Sum counts per group (e.g., per city)

    # Format into the final list structure
    final_data = []
    all_pivot_keys = sorted(list(top_letters)) + (
        [OTHER_CATEGORY_NAME]
        if any(OTHER_CATEGORY_NAME in d for d in temp_pivoted_data.values())
        else []
    )

    for group_val in all_groups:
        data_entry: Dict[str, Union[str, int]] = {group_by_key: group_val}
        group_total = (
            group_totals.get(group_val, 1) if normalize and group_totals else 1
        )  # Avoid division by zero
        if group_total == 0:
            group_total = 1  # Avoid division by zero

        for pivot_val in all_pivot_keys:
            raw_value = temp_pivoted_data[group_val].get(pivot_val, 0)
            # Normalize to percentage if requested, otherwise use raw count
            data_entry[pivot_val] = (
                round((raw_value / group_total) * 100) if normalize else raw_value
            )
        final_data.append(data_entry)

    return final_data


# --- Analytics API Endpoints ---


@router.get(
    "/industry-distribution",
    response_model=List[IndustryDistributionDetailItem],
    summary="Get overall industry distribution (Top 10 + Other) with breakdown",
    description="Calculates the distribution of the top 10 main industry letters, grouping others and providing breakdown.",
)
async def get_industry_distribution(
    cities: Optional[str] = Query(
        None, description="Comma-separated cities. If None, calculates for all."
    ),
    db: Session = Depends(get_db),
):
    city_list = (
        [city.strip() for city in cities.split(",") if city.strip()] if cities else []
    )
    try:
        top_letters = get_top_n_industry_letters(db, city_list)
        stmt = (
            select(
                MainBusinessLine.industry_letter,
                func.count(distinct(Company.business_id)).label("count"),
            )
            .join(MainBusinessLine, Company.business_id == MainBusinessLine.business_id)
            .where(MainBusinessLine.industry_letter is not None)
            .group_by(MainBusinessLine.industry_letter)
        )
        if city_list:
            stmt = stmt.join(Address, Company.business_id == Address.business_id)
            stmt = stmt.where(Address.city.in_(city_list))

        results = db.execute(stmt).all()
        return group_data_for_distribution(results, top_letters)
    except Exception as e:
        print(f"Error fetching industry distribution: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/city-comparison",
    response_model=List[Dict[str, Any]],
    summary="Compare normalized industry distribution (Top 10 + Other) across cities",
    description="Returns normalized (percentage) distribution for top 10 industries + Other across cities.",
)
async def get_city_comparison(
    cities: str = Query(..., description="Comma-separated list of cities (required)."),
    db: Session = Depends(get_db),
):
    city_list = [city.strip() for city in cities.split(",") if city.strip()]
    if not city_list:
        raise HTTPException(
            status_code=400, detail="At least one city must be specified."
        )
    try:
        # Find top letters based on the selected cities
        top_letters = get_top_n_industry_letters(db, city_list)
        stmt = (
            select(
                MainBusinessLine.industry_letter.label("industry"),  # pivot_key
                Address.city,  # group_by_key -> becomes column header
                func.count(distinct(Company.business_id)).label("count"),  # value_key
            )
            .select_from(Company)
            .join(Address, Company.business_id == Address.business_id)
            .join(MainBusinessLine, Company.business_id == MainBusinessLine.business_id)
            .where(Address.city.in_(city_list))
            .where(MainBusinessLine.industry_letter is not None)
            .group_by(MainBusinessLine.industry_letter, Address.city)
        )
        results = db.execute(stmt).all()

        # Pivot data for the Radar chart format: { industry: 'A', City1: %, City2: % }
        # We need to normalize *within* each city first
        city_totals = defaultdict(int)
        raw_counts = defaultdict(lambda: defaultdict(int))
        all_industries_in_results = set()
        for row in results:
            if row.industry and row.city in city_list:
                city_totals[row.city] += row.count
                raw_counts[row.industry][row.city] = row.count
                all_industries_in_results.add(row.industry)

        # Group into top N + Other based on overall counts (or use top_letters already calculated)
        final_pivot = defaultdict(lambda: {city: 0 for city in city_list})
        for industry_letter in all_industries_in_results:
            category = (
                industry_letter
                if industry_letter in top_letters
                else OTHER_CATEGORY_NAME
            )
            for city in city_list:
                final_pivot[category][city] += raw_counts[industry_letter].get(city, 0)

        # Format and Normalize
        final_data = []
        for category in sorted(list(final_pivot.keys())):
            data_entry = {"industry": category}  # Category is Letter or 'Other'
            for city in city_list:
                total = city_totals.get(city, 1)
                if total == 0:
                    total = 1  # Avoid division by zero
                data_entry[city] = round(
                    (final_pivot[category].get(city, 0) / total) * 100
                )
            final_data.append(data_entry)

        return final_data

    except Exception as e:
        print(f"Error fetching city comparison data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/industries-by-city",
    response_model=List[Dict[str, Any]],
    summary="Get Top 10 + Other industry counts for each city",
    description="Returns data with cities and counts for top 10 industries and 'Other'.",
)
async def get_industries_by_city(
    cities: str = Query(..., description="Comma-separated list of cities (required)."),
    db: Session = Depends(get_db),
):
    city_list = [city.strip() for city in cities.split(",") if city.strip()]
    if not city_list:
        raise HTTPException(
            status_code=400, detail="At least one city must be specified."
        )
    try:
        # Find top letters based on the selected cities
        top_letters = get_top_n_industry_letters(db, city_list)
        stmt = (
            select(
                Address.city,  # group_by_key
                MainBusinessLine.industry_letter.label("industry"),  # pivot_key
                func.count(distinct(Company.business_id)).label("count"),  # value_key
            )
            .select_from(Company)
            .join(Address, Company.business_id == Address.business_id)
            .join(MainBusinessLine, Company.business_id == MainBusinessLine.business_id)
            .where(Address.city.in_(city_list))
            .where(MainBusinessLine.industry_letter is not None)
            .group_by(Address.city, MainBusinessLine.industry_letter)
        )
        results = db.execute(stmt).all()

        # Use the generic pivot helper, don't normalize counts
        return pivot_and_group_data(
            results,
            top_letters=top_letters,
            group_by_key="city",
            pivot_key="industry",
            value_key="count",
            all_groups=city_list,
            normalize=False,
        )

    except Exception as e:
        print(f"Error fetching industries by city data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get(
    "/top-cities",
    response_model=List[TopCityItem],
    summary="Get top cities by active company count",
    description="Ranks cities based on the total number of unique active companies located there.",
)
async def get_top_cities(
    limit: int = Query(10, description="Number of top cities to return", ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Fetches the top N cities ranked by the total count of unique active companies."""
    try:
        # Corrected Query: Select city, COUNT(DISTINCT active company business_id)
        stmt = (
            select(
                Address.city, func.count(distinct(Company.business_id)).label("count")
            )
            .select_from(Address)  # Start from Address
            .join(Company, Address.business_id == Company.business_id)
            .where(Address.city is not None)
            .where(Company.active)  # Fix E712 and filter for active companies
            .group_by(Address.city)
            .order_by(
                func.count(distinct(Company.business_id)).desc()
            )  # Order by active company count
            .limit(limit)
        )

        results = db.execute(stmt).all()

        formatted_results = [
            TopCityItem(city=row.city, count=row.count) for row in results
        ]

        return formatted_results

    except Exception as e:
        print(f"Error fetching top cities data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
