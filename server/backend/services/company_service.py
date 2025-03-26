from typing import Dict, List, Optional
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Query

def get_business_data(
    db: Session,
    city: str,
    company_name: Optional[str] = None,
    company_type: Optional[str] = None,
    industry_description: Optional[str] = None,
    active: Optional[bool] = None,
    sort_by: Optional[str] = "company_name",
    order: Optional[str] = "asc",
    limit: int = 25,
    offset: int = 0
) -> Dict:
    """Fetches business data with filtering, sorting, pagination, and total count."""

    valid_sort_columns = {
        "business_id", "company_name", "company_type",
        "industry_description", "city", "active"
    }

    if sort_by not in valid_sort_columns:
        sort_by = "company_name"  # Default sorting column

    order = "DESC" if order.lower() == "desc" else "ASC"

    # 1️⃣ Count total number of businesses (without pagination)
    total_query = """
        SELECT COUNT(DISTINCT b.business_id)
        FROM addresses a
        JOIN businesses b ON a.business_id = b.business_id
        LEFT JOIN industry_classifications ic ON ic.business_id = a.business_id
        WHERE a.city = :city
    """

    total_filters = {"city": city}

    if company_name:
        total_query += " AND b.company_name ILIKE :company_name"
        total_filters["company_name"] = f"%{company_name}%"

    if company_type:
        total_query += " AND b.company_type = :company_type"
        total_filters["company_type"] = company_type

    if industry_description:
        total_query += " AND ic.industry_description ILIKE :industry_description"
        total_filters["industry_description"] = f"%{industry_description}%"

    if active is not None:
        total_query += " AND a.active = :active"
        total_filters["active"] = active

    total_result = db.execute(text(total_query), total_filters)
    total = total_result.scalar()  # Extracts the total count

    # 2️⃣ Fetch paginated business data
    data_query = """
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
        WHERE a.city = :city
    """

    filters = {"city": city}

    if company_name:
        data_query += " AND b.company_name ILIKE :company_name"
        filters["company_name"] = f"%{company_name}%"

    if company_type:
        data_query += " AND b.company_type = :company_type"
        filters["company_type"] = company_type

    if industry_description:
        data_query += " AND ic.industry_description ILIKE :industry_description"
        filters["industry_description"] = f"%{industry_description}%"

    if active is not None:
        data_query += " AND a.active = :active"
        filters["active"] = active

    data_query += f" ORDER BY {sort_by} {order} LIMIT :limit OFFSET :offset"
    filters["limit"] = limit
    filters["offset"] = offset

    result = db.execute(text(data_query), filters)
    businesses = [dict(row._mapping) for row in result]

    # 3️⃣ Return both paginated data & total count
    return {
        "total": total,  # 🔥 Total number of businesses
        "data": businesses
    }
