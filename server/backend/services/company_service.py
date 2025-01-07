"""This module provides services for retrieving company data."""

from typing import Any, Dict, List

from sqlalchemy.orm import Session

from server.backend.models.company import Company


def get_paginated_companies(
    db: Session, page: int, page_size: int
) -> List[Dict[str, Any]]:
    offset = (page - 1) * page_size
    companies = db.query(Company).offset(offset).limit(page_size).all()
    return [
        {
            "business_id": company.business_id,
            "website": company.website,
            "company_id_status": company.company_id_status,
            "trade_register_status": company.trade_register_status,
            "registration_date": company.registration_date,
            "end_date": company.end_date,
            "last_modified": company.last_modified,
            "addresses": [
                {
                    "type": address.type,
                    "street": address.street,
                    "post_code": address.post_code,
                }
                for address in company.addresses
            ],
            "main_business_lines": [
                {
                    "industry_code": business_line.industry_code,
                    "industry": business_line.industry,
                    "industry_description": business_line.industry_description,
                }
                for business_line in company.main_business_lines
            ],
            "registered_entries": [
                {
                    "registration_status_code": entry.registration_status_code,
                    "registration_date": entry.registration_date,
                    "end_date": entry.end_date,
                    "register": entry.register,
                    "authority": entry.authority,
                }
                for entry in company.registered_entries
            ],
            "company_forms": [
                {
                    "business_form": form.business_form,
                    "version": form.version,
                    "registration_date": form.registration_date,
                    "end_date": form.end_date,
                }
                for form in company.company_forms
            ],
            "post_offices": [
                {
                    "post_code": post_office.post_code,
                    "city": post_office.city,
                    "municipality_code": post_office.municipality_code,
                    "active": post_office.active,
                }
                for post_office in company.post_offices
            ],
            "company_situations": [
                {
                    "type": situation.type,
                    "registration_date": situation.registration_date,
                    "source": situation.source,
                }
                for situation in company.company_situations
            ],
        }
        for company in companies
    ]
