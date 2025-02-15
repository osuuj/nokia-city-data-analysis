from typing import Dict, List

from fastapi import APIRouter, Depends, Query
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