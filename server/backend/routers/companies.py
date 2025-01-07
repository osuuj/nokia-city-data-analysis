"""This module defines the API endpoints for retrieving company data."""

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.backend.database import get_db
from server.backend.services.company_service import get_paginated_companies

router = APIRouter()


@router.get("/companies", response_model=List[Dict[str, Any]])
def read_companies(
    page: int = Query(1, alias="page", description="Page number"),
    page_size: int = Query(
        10, alias="page_size", description="Number of items per page"
    ),
    db: Session = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Retrieve paginated companies.

    Args:
        page (int): Page number.
        page_size (int): Number of items per page.
        db (Session): Database session.

    Returns:
        List[Dict[str, Any]]: List of companies.
    """
    return get_paginated_companies(db, page, page_size)
