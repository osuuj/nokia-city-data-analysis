from typing import Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.backend.database import get_db

router = APIRouter()

@router.get("/companies/")
def get_business_data(
    city: str = Query(..., description="City name to filter by"),
    company_name: str = Query(None, description="Company name to filter by"),
    company_type: str = Query(None, description="Company type to filter by"),
    industry_description: str = Query(None, description="Industry description to filter by"),
    active: bool = Query(None, description="Active status to filter by"),
    sort_by: str = Query("company_name", description="Column to sort by"),
    order: str = Query("asc", description="Sorting order ('asc' or 'desc')"),
    limit: int = Query(25, enum=[25,50], description="Number of records to return (25 or 50)"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    db: Session = Depends(get_db),
) -> Dict:
    """Retrieve business data with filtering and sorting.

    Args:
        city (str): City name to filter by.
        company_name (str): Company name to filter by.
        company_type (str): Company type to filter by.
        industry_description (str): Industry description to filter by.
        active (bool): Active status to filter by.
        sort_by (str): Column to sort by.
        order (str): Sorting order ('asc' or 'desc').
        limit (int): Number of records to return.
        offset (int): Number of records to skip (for pagination).
        db (Session): Database session.

    Returns:
        List[Dict]: List of business data.
    """

    print(sort_by)

    valid_sort_columns = {
        "business_id", "company_name", "company_type",
        "industry_description", "city", "active"
    }

    if sort_by not in valid_sort_columns:
        sort_by = "company_name"  # Default sorting column

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

    order = "DESC" if order.lower() == "desc" else "ASC"

    max_pages = (total + limit - 1) // limit  # Ceiling division to get last valid page

    if page > max_pages:
        return {"total": total, "data": []}  # 🔥 Prevents invalid DB queries

    offset = (page - 1) * limit  # 🔥 Convert `page` to `offset`

    # 2️⃣ Fetch paginated unique business data using GROUP BY
    data_query = f"""
        SELECT
            b.business_id,
            MAX(b.company_name) AS company_name,
            MAX(b.company_type) AS company_type,
            COALESCE(MAX(ic.industry_description), '') AS industry_description,
            COALESCE(MAX(w.website), '') AS website,
            MAX(a.street) AS street,
            MAX(a.building_number) AS building_number,
            COALESCE(MAX(a.entrance), '') AS entrance,
            CAST(MAX(a.postal_code) AS TEXT) AS postal_code,
            MAX(a.city) AS city,
            CAST(MAX(a.latitude_wgs84) AS TEXT) AS latitude_wgs84,
            CAST(MAX(a.longitude_wgs84) AS TEXT) AS longitude_wgs84,
            MAX(a.address_type) AS address_type,
            CAST(MAX(CASE WHEN a.active THEN 1 ELSE 0 END) AS TEXT) AS active
        FROM businesses b
        JOIN addresses a ON a.business_id = b.business_id
        LEFT JOIN LATERAL (
            SELECT industry_description
            FROM industry_classifications ic
            WHERE ic.business_id = b.business_id
            ORDER BY ic.registration_date DESC
            LIMIT 1
        ) ic ON true
        LEFT JOIN LATERAL (
            SELECT website
            FROM websites w
            WHERE w.business_id = b.business_id
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

    data_query += f" GROUP BY b.business_id ORDER BY {sort_by} {order} LIMIT :limit OFFSET :offset"
    filters["limit"] = limit
    filters["offset"] = offset

    result = db.execute(text(data_query), filters)
    businesses = [dict(row._mapping) for row in result]

    totalPages = (total + limit - 1) // limit  # Calculate total pages

    return {
        "total": total,  # Total unique businesses
        "data": businesses,
        "limit": limit,
        "page": page,
        "totalPages": totalPages,
    }

@router.get("/cities", response_model=List[str])
def get_cities(db: Session = Depends(get_db)) -> List[str]:
    """Retrieve all cities.

    Args:
        db (Session): Database session.

    Returns:
        List[str]: List of cities.
    """
    query = text("SELECT DISTINCT city FROM addresses")
    result = db.execute(query).scalars().all()
    return result