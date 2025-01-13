"""This module provides services for retrieving company data.

- Implements data retrieval logic using SQLAlchemy ORM.
- Maps SQLAlchemy results to Pydantic schemas.
- Supports pagination for efficient data handling.
"""

from typing import List

from sqlalchemy.orm import Session

from server.backend.models.company import Company
from server.backend.schemas.company import CompanySchema


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

    return [CompanySchema.from_orm(company) for company in companies]
