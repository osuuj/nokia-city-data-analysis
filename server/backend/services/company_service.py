from sqlalchemy.orm import Session

from server.backend.models.company import Address, Company, Name


def get_paginated_companies_with_postal_addresses(
    db: Session, page: int, page_size: int
):
    # Paginated query
    results = (
        db.query(Company, Address, Name)
        .join(Address)
        .join(Name)
        .filter(
            Company.status == "Valid",
            Address.type == "Postal address",
            Name.type == "Company name",
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return [
        {
            "business_id": company.business_id,
            "company_name": name.name,
            "street": address.street,
            "building_number": address.building_number,
            "post_code": address.post_code,
            "country": address.country,
            "registration_date": name.registration_date,
            "name_source": name.source,
        }
        for company, address, name in results
    ]
