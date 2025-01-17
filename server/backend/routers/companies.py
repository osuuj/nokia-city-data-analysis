"""This module defines the API endpoints for retrieving company data.

- Provides endpoints for paginated company retrieval.
- Uses Pydantic schemas for response validation.
- Depends on database services for data access.

"""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.backend.database import get_db
from server.backend.schemas.address_schema import AddressSchema
from server.backend.schemas.company_schema import CompanySchema
from server.backend.services.company_service import (
    get_paginated_addresses,
    get_paginated_companies,
)

router = APIRouter()


@router.get("/companies", response_model=List[CompanySchema])
def read_companies(
    page: int = Query(1, alias="page", description="Page number"),
    page_size: int = Query(
        10, alias="page_size", description="Number of items per page"
    ),
    db: Session = Depends(get_db),
) -> List[CompanySchema]:
    """Retrieve paginated companies.

    Args:
        page (int): Page number.
        page_size (int): Number of items per page.
        db (Session): Database session.

    Returns:
        List[CompanySchema]: List of companies.
    """
    return get_paginated_companies(db, page, page_size)


@router.get("/addresses", response_model=List[AddressSchema])
def read_paginated_addresses(
    page: int = Query(1, alias="page", description="Page number"),
    page_size: int = Query(
        10, alias="page_size", description="Number of items per page"
    ),
    db: Session = Depends(get_db),
) -> List[AddressSchema]:
    """Endpoint to retrieve paginated addresses.

    Args:
        page (int): Page number.
        page_size (int): Number of items per page.
        db (Session): Database session.

    Returns:
        List[AddressSchema]: List of addresses.
    """
    return get_paginated_addresses(db, page, page_size)
