"""This module defines the API endpoints for retrieving company data with valid postal addresses."""

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.backend.database import get_db
from server.backend.services.company_service import (
    get_paginated_companies_with_postal_addresses,
)

router = APIRouter()


@router.get("/companies/valid-postal", response_model=List[Dict[str, Any]])
def get_companies_with_postal_addresses(
    page: int = Query(1, ge=1),  # Pagination: Page number
    page_size: int = Query(100, ge=1, le=1000),  # Pagination: Page size
    db: Session = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Retrieve a paginated list of companies with valid postal addresses.

    Args:
        page (int): The page number for pagination.
        page_size (int): The number of items per page for pagination.
        db (Session): The database session.

    Returns:
        List[Dict[str, Any]]: A list of dictionaries containing company data with valid postal addresses.
    """
    return get_paginated_companies_with_postal_addresses(db, page, page_size)
