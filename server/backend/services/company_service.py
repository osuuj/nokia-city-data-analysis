from typing import List

from sqlalchemy import text
from sqlalchemy.orm import Session

from server.backend.schemas.company_schema import BusinessData


def get_business_data_by_city(db: Session, city: str) -> List[BusinessData]:
    """Fetches business data for companies that have a postal address in the given city. Also includes all their other addresses (e.g., visiting).

    Args:
        db (Session): SQLAlchemy database session.
        city (str): Name of the city to filter by postal address.

    Returns:
        List[BusinessData]: List of business data records.
    """
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

    result = db.execute(query, {"city": city})
    return [BusinessData(**row._mapping) for row in result]
