"""This module provides services for retrieving company data.

- Implements data retrieval logic using SQLAlchemy ORM.
- Maps SQLAlchemy results to Pydantic schemas.
- Supports pagination for efficient data handling.
"""

from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from server.backend.models.company import Address, Company
from server.backend.schemas.address_schema import AddressSchema
from server.backend.schemas.company_schema import CompanySchema


def get_paginated_companies(
    db: Session, page: int, page_size: int
) -> List[CompanySchema]:
    """Retrieve paginated companies from the database.

    Args:
        db (Session): Database session.
        page (int): Page number.
        page_size (int): Number of items per page.

    Returns:
        List[CompanySchema]: List of company schemas.
    """
    offset = (page - 1) * page_size
    companies = db.query(Company).offset(offset).limit(page_size).all()

    return [CompanySchema.model_validate(company) for company in companies]


def get_paginated_addresses(
    db: Session, page: int, page_size: int
) -> List[AddressSchema]:
    """Retrieve paginated addresses from the addresses table.

    Args:
        db (Session): Database session.
        page (int): Page number.
        page_size (int): Number of items per page.

    Returns:
        List[AddressSchema]: List of addresses.
    """
    offset = (page - 1) * page_size
    stmt = select(Address).offset(offset).limit(page_size)
    results = db.execute(stmt).scalars().all()

    return [AddressSchema.model_validate(address) for address in results]
