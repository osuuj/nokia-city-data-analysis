"""Company data service module.

This module provides services for retrieving and processing company data.
"""

import logging
from typing import List, Optional, cast

from sqlalchemy import and_, distinct, func, select, text
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
                cast(Address.postal_code, str).label("postal_code"),
                Address.city,
                cast(Address.latitude_wgs84, str).label("latitude_wgs84"),
                cast(Address.longitude_wgs84, str).label("longitude_wgs84"),
                Address.address_type,
                cast(Address.active, str).label("active"),
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
                    cast(
                        select(IndustryClassification.registration_date)
                        .where(
                            IndustryClassification.business_id == Address.business_id
                        )
                        .order_by(IndustryClassification.registration_date.desc())
                        .limit(1)
                        .scalar_subquery(),
                        str,
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


async def get_business_data_by_city_raw_sql(
    db: AsyncSession, city: str
) -> List[BusinessData]:
    """Fetches business data for companies using the original raw SQL query.

    Kept for comparison and fallback purposes. This is the legacy implementation.

    Args:
        db: SQLAlchemy async database session
        city: Name of the city to filter by postal address

    Returns:
        List of business data records
    """
    try:
        # Original SQL query kept for reference and testing
        query = text(
            """
            WITH companies_with_postal_in_city AS (
                SELECT DISTINCT business_id
                FROM addresses
                 WHERE city = :city
                    AND address_type IN ('Postal address', 'Visiting address')
            )
            SELECT
                a.business_id,
                a.street,
                a.building_number,
                COALESCE(a.entrance, '') AS entrance,
                CAST(a.postal_code AS TEXT) AS postal_code,
                a.city,
                CAST(a.latitude_wgs84 AS TEXT) AS latitude_wgs84,
                CAST(a.longitude_wgs84 AS TEXT) AS longitude_wgs84,
                a.address_type,
                CAST(a.active AS TEXT) AS active,
                b.company_name,
                b.company_type,
                COALESCE(ic.industry_description, '') AS industry_description,
                COALESCE(ic.industry_letter, '') AS industry_letter,
                COALESCE(ic.industry, '') AS industry,
                COALESCE(CAST(ic.registration_date AS TEXT), '') AS registration_date,
                COALESCE(w.website, '') AS website
            FROM addresses a
            JOIN companies_with_postal_in_city cpc ON a.business_id = cpc.business_id
            JOIN businesses b ON a.business_id = b.business_id
            LEFT JOIN LATERAL (
                SELECT industry_description, industry_letter, industry, registration_date
                FROM industry_classifications ic
                WHERE ic.business_id = a.business_id
                ORDER BY ic.registration_date DESC
                LIMIT 1
            ) ic ON true
            LEFT JOIN LATERAL (
                SELECT website
                FROM websites w
                WHERE w.business_id = a.business_id
                ORDER BY w.registration_date DESC
                LIMIT 1
            ) w ON true
            """
        )

        result = await db.execute(query, {"city": city})
        return [BusinessData(**row._mapping) for row in result]

    except Exception as e:
        logger.error(f"Error fetching business data for city {city} (raw SQL): {e}")
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
                Address.entrance,
                Address.postal_code,
                Address.city,
                Address.latitude_wgs84,
                Address.longitude_wgs84,
                Address.address_type,
                Address.active,
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
                func.coalesce(IndustryClassification.registration_date, "").label(
                    "registration_date"
                ),
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
