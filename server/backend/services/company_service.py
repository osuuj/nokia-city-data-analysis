from typing import Dict, List

from sqlalchemy import text
from sqlalchemy.orm import Session


def get_business_data_by_city(db: Session, city: str) -> List[Dict]:
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
        COALESCE(w.website, '') AS website
    FROM
        addresses a
    JOIN
        businesses b ON a.business_id = b.business_id
    LEFT JOIN
        industry_classifications ic ON a.business_id = ic.business_id
    LEFT JOIN
        websites w ON a.business_id = w.business_id
    WHERE
        a.city = :city;
    """
    )
    result = db.execute(query, {"city": city})
    return [dict(row) for row in result.mappings()]
