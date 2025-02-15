from typing import Dict, List

from sqlalchemy import text
from sqlalchemy.orm import Session


def get_business_data_by_city(db: Session, city: str) -> List[Dict]:
    """Fetches business data for a given city using optimized queries.

    Args:
        db (Session): SQLAlchemy database session.
        city (str): Name of the city to filter businesses.

    Returns:
        List[Dict]: List of business data records.
    """
    query = text(
        """
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
            COALESCE(w.website, '') AS website  -- ✅ Handles NULL values in SQL
        FROM addresses a
        JOIN businesses b ON a.business_id = b.business_id
        LEFT JOIN LATERAL (
            SELECT industry_description
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
        WHERE a.city = :city;
        """
    )
    result = db.execute(query, {"city": city})
    return [dict(row._mapping) for row in result]  # ✅ Faster dictionary conversion