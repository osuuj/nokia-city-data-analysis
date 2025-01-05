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
    # Call the paginated query service
    return get_paginated_companies_with_postal_addresses(db, page, page_size)
