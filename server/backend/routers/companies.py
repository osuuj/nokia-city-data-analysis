from typing import Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.backend.database import get_db
from server.backend.services.company_service import get_business_data_by_city

router = APIRouter()


@router.get("/businesses_by_city", response_model=List[Dict[str, str]])
def read_businesses_by_city(
    city: str = Query(..., description="City name to filter by"),
    db: Session = Depends(get_db),
) -> List[Dict[str, str]]:
    """Retrieve business data by city.

    Args:
        city (str): City name to filter by.
        db (Session): Database session.

    Returns:
        List[Dict[str, str]]: List of business data.
    """
    return get_business_data_by_city(db, city)

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


