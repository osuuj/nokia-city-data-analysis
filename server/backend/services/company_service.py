"""Company data service module.

This module provides services for retrieving and processing company data.
"""

import logging
from typing import Any, List, Optional, Tuple

from sqlalchemy import Float, String, and_, distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import settings
from ..models.company import (  # pyright: ignore[reportMissingImports, reportAttributeAccessIssue]
    Address,
    Company,
    IndustryClassification,
    Website,
)
from ..schemas.company_schema import BusinessData
from ..utils.cache import cached

# Configure logger
logger = logging.getLogger(__name__)


async def get_business_data_by_city(db: AsyncSession, city: str) -> List[BusinessData]:
    """Fetches business data for companies in a city using SQLAlchemy expressions.

    Args:
        db: SQLAlchemy async database session
        city: Name of the city to filter by

    Returns:
        List of business data records
    """
    try:
        # First, find all businesses that have an address in the target city
        # This is equivalent to the CTE in the original SQL
        companies_with_address_in_city = (
            select(Address.business_id)
            .where(
                and_(
                    Address.city == city,
                    Address.address_type.in_(["Postal address", "Visiting address"]),
                )
            )
            .distinct()
            .subquery()
        )

        # Now get all addresses for these businesses
        stmt = (
            select(
                Address.business_id,
                Address.street,
                Address.building_number,
                func.coalesce(Address.entrance, "").label("entrance"),
                func.cast(Address.postal_code, String).label("postal_code"),
                Address.city,
                func.cast(Address.latitude_wgs84, Float).label("latitude_wgs84"),
                func.cast(Address.longitude_wgs84, Float).label("longitude_wgs84"),
                Address.address_type,
                func.cast(Address.active, String).label("active"),
                Company.company_name,
                Company.company_type,
                # Get industry data using a correlated subquery
                func.coalesce(
                    select(IndustryClassification.industry_description)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label(
                    "industry_description"
                ),  # pyright: ignore[reportInvalidTypeForm]
                func.coalesce(
                    select(IndustryClassification.industry_letter)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label(
                    "industry_letter"
                ),  # pyright: ignore[reportInvalidTypeForm]
                func.coalesce(
                    select(IndustryClassification.industry)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label(
                    "industry"
                ),  # pyright: ignore[reportInvalidTypeForm]
                func.coalesce(
                    func.cast(
                        select(IndustryClassification.registration_date)
                        .where(
                            IndustryClassification.business_id == Address.business_id
                        )
                        .order_by(IndustryClassification.registration_date.desc())
                        .limit(1)
                        .scalar_subquery(),
                        String,
                    ),
                    "",
                ).label(
                    "registration_date"
                ),  # pyright: ignore[reportInvalidTypeForm]
                # Get website using a correlated subquery
                func.coalesce(
                    select(Website.website)
                    .where(Website.business_id == Address.business_id)
                    .order_by(Website.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label(
                    "website"
                ),  # pyright: ignore[reportInvalidTypeForm]
            )
            .join(
                companies_with_address_in_city,
                Address.business_id == companies_with_address_in_city.c.business_id,
            )
            .join(Company, Address.business_id == Company.business_id)
        )

        result = await db.execute(stmt)
        return [BusinessData(**row._mapping) for row in result]

    except Exception as e:
        logger.error(f"Error fetching business data for city {city}: {e}")
        raise


async def get_companies_by_industry(
    db: AsyncSession, industry_letter: str, limit: int = 100, city: Optional[str] = None
) -> List[BusinessData]:
    """Fetches business data for companies in a specific industry.

    Args:
        db: SQLAlchemy async database session
        industry_letter: Industry letter code to filter by
        limit: Maximum number of companies to return
        city: Optional city to filter by

    Returns:
        List of business data records
    """
    try:
        # Begin constructing the subquery to find companies with the given industry
        companies_with_industry = (
            select(IndustryClassification.business_id)
            .where(IndustryClassification.industry_letter == industry_letter)
            .distinct()
            .subquery()
        )

        # Construct the main query
        stmt = (
            select(
                Address.business_id,
                Address.street,
                Address.building_number,
                func.coalesce(Address.entrance, "").label("entrance"),
                func.cast(Address.postal_code, String).label("postal_code"),
                Address.city,
                func.cast(Address.latitude_wgs84, Float).label("latitude_wgs84"),
                func.cast(Address.longitude_wgs84, Float).label("longitude_wgs84"),
                Address.address_type,
                func.cast(Address.active, String).label("active"),
                Company.company_name,
                Company.company_type,
                # Using the most recent industry classification
                func.coalesce(IndustryClassification.industry_description, "").label(
                    "industry_description"
                ),
                func.coalesce(IndustryClassification.industry_letter, "").label(
                    "industry_letter"
                ),
                func.coalesce(IndustryClassification.industry, "").label("industry"),
                func.coalesce(
                    func.cast(IndustryClassification.registration_date, String), ""
                ).label("registration_date"),
                func.coalesce(Website.website, "").label("website"),
            )
            .join(
                companies_with_industry,
                Address.business_id == companies_with_industry.c.business_id,
            )
            .join(Company, Address.business_id == Company.business_id)
            .outerjoin(
                IndustryClassification,
                and_(
                    Address.business_id == IndustryClassification.business_id,
                    IndustryClassification.industry_letter == industry_letter,
                ),
            )
            .outerjoin(Website, Address.business_id == Website.business_id)
        )

        # Add city filter if provided
        if city:
            stmt = stmt.where(Address.city == city)

        # Add ordering and limit
        stmt = stmt.order_by(Company.company_name).limit(limit)

        result = await db.execute(stmt)
        return [BusinessData(**row._mapping) for row in result]

    except Exception as e:
        logger.error(f"Error fetching companies by industry {industry_letter}: {e}")
        raise


@cached(
    ttl_seconds=settings.CACHE_TTL_MEDIUM
)  # Cache for 1 hour since cities rarely change
async def get_cities(db: AsyncSession) -> List[str]:
    """Get a list of all distinct cities from the database.

    Results are cached for 1 hour to improve performance.

    Args:
        db: SQLAlchemy async database session

    Returns:
        List of city names
    """
    try:
        # Create a query to select distinct non-null cities, ordered by name
        stmt = (
            select(distinct(Address.city))
            .where(Address.city.is_not(None))
            .order_by(Address.city)
        )

        result = await db.execute(stmt)
        return list(result.scalars().all())  # Explicitly convert to list

    except Exception as e:
        logger.error(f"Error fetching list of cities: {e}")
        raise


@cached(
    ttl_seconds=settings.CACHE_TTL_MEDIUM
)  # Cache for 1 hour since industry codes rarely change
async def get_industries(db: AsyncSession) -> List[str]:
    """Get a list of all distinct industry letter codes from the database.

    Results are cached for 1 hour to improve performance.

    Args:
        db: SQLAlchemy async database session

    Returns:
        List of industry letter codes
    """
    try:
        # Create a query to select distinct non-null industry letters, ordered by letter
        stmt = (
            select(distinct(IndustryClassification.industry_letter))
            .where(IndustryClassification.industry_letter.is_not(None))
            .order_by(IndustryClassification.industry_letter)
        )

        result = await db.execute(stmt)
        return list(result.scalars().all())  # Explicitly convert to list

    except Exception as e:
        logger.error(f"Error fetching list of industry codes: {e}")
        raise


async def get_business_data_by_city_keyset(
    db: AsyncSession,
    city: str,
    last_id: Optional[str] = None,
    limit: int = 5000,
) -> Tuple[List[Any], Optional[str]]:
    """Keyset-based batch fetch for GeoJSON company data.

    Returns a tuple of (all address-rows, last_business_id).

    - `limit` is how many unique business_ids to pull.
    - The returned `last_business_id` is the business_id of the final row IF
      exactly `limit` distinct IDs were found; otherwise None.
    """
    try:
        # Step 1: fetch the next `limit` distinct business_ids (ordered by business_id)
        business_id_query = (
            select(distinct(Company.business_id))
            .join(Address, Company.business_id == Address.business_id)
            .where(
                and_(
                    Address.city == city,
                    Address.address_type.in_(["Postal address", "Visiting address"]),
                    Company.business_id > (last_id or ""),
                )
            )
            .order_by(Company.business_id)
            .limit(limit)
        )
        result_ids = await db.execute(business_id_query)
        business_ids = result_ids.scalars().all()

        if not business_ids:
            # No further IDs, so no rows, and no next page.
            return [], None

        # If we got exactly `limit` IDs, we know there might be more pages,
        # so last_business_id = the final ID in business_ids. If fewer than `limit`,
        # then this page is the final page, so next_last_id = None.
        next_last_id = business_ids[-1] if len(business_ids) == limit else None

        # Step 2: pull all address rows (plus any joined columns) for those IDs:
        stmt = (
            select(
                Address.business_id,
                Address.street,
                Address.building_number,
                func.coalesce(Address.entrance, "").label("entrance"),
                func.cast(Address.postal_code, String).label("postal_code"),
                Address.city,
                func.cast(Address.latitude_wgs84, String).label("latitude_wgs84"),
                func.cast(Address.longitude_wgs84, String).label("longitude_wgs84"),
                Address.address_type,
                func.coalesce(func.cast(Address.active, String), "").label("active"),
                Company.company_name,
                Company.company_type,
                func.coalesce(
                    # latest industry_description
                    select(IndustryClassification.industry_description)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label("industry_description"),
                func.coalesce(
                    # latest industry_letter
                    select(IndustryClassification.industry_letter)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label("industry_letter"),
                func.coalesce(
                    # latest industry
                    select(IndustryClassification.industry)
                    .where(IndustryClassification.business_id == Address.business_id)
                    .order_by(IndustryClassification.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label("industry"),
                func.coalesce(
                    # latest registration_date
                    func.cast(
                        select(IndustryClassification.registration_date)
                        .where(
                            IndustryClassification.business_id == Address.business_id
                        )
                        .order_by(IndustryClassification.registration_date.desc())
                        .limit(1)
                        .scalar_subquery(),
                        String,
                    ),
                    "",
                ).label("registration_date"),
                func.coalesce(
                    # latest website
                    select(Website.website)
                    .where(Website.business_id == Address.business_id)
                    .order_by(Website.registration_date.desc())
                    .limit(1)
                    .scalar_subquery(),
                    "",
                ).label("website"),
            )
            .join(Company, Address.business_id == Company.business_id)
            .where(Address.business_id.in_(business_ids))
        )

        result = await db.execute(stmt)
        businesses = [row._mapping for row in result]
        logger.info(
            f"Fetched {len(businesses)} rows for {len(business_ids)} businesses"
        )
        return businesses, next_last_id

    except Exception as e:
        logger.error(f"Error fetching business data by keyset: {e}")
        raise


async def get_company_count_by_city(db: AsyncSession, city: str) -> int:
    """Get the total count of companies in a city.

    Args:
        db: SQLAlchemy async database session
        city: Name of the city to count companies in

    Returns:
        Total number of companies in the city
    """
    try:
        # Count distinct business_ids that have an address in the target city
        stmt = (
            select(func.count(distinct(Company.business_id)))
            .join(Address, Company.business_id == Address.business_id)
            .where(
                and_(
                    Address.city == city,
                    Address.address_type.in_(["Postal address", "Visiting address"]),
                )
            )
        )

        result = await db.execute(stmt)
        return result.scalar_one() or 0

    except Exception as e:
        logger.error(f"Error counting companies in city {city}: {e}")
        raise
