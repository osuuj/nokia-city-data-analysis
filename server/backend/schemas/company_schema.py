"""This module defines Pydantic models for serialization and validation of API data.

- Models include Company, Address, Name, and other related entities.
- Uses `from_attributes` for compatibility with SQLAlchemy models.
- Ensures type-safety and clean validation logic.
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel


class AddressSchema(BaseModel):
    """Pydantic schema for Address entity."""

    street: Optional[str]
    building_number: Optional[str]
    entrance: Optional[str]
    apartment_number: Optional[str]
    apartment_id_suffix: Optional[str]
    post_office_box: Optional[str]
    post_code: Optional[str]
    co: Optional[str]
    country: Optional[str]
    free_address_line: Optional[str]
    registration_date: Optional[date]
    source: Optional[str]

    class Config:
        """Configuration for AddressSchema."""

        from_attributes = True


class NameSchema(BaseModel):
    """Pydantic schema for Name entity."""

    company_name: str
    version: int
    company_type: Optional[str]
    registration_date: Optional[date]
    end_date: Optional[date]
    source: Optional[str]

    class Config:
        """Configuration for NameSchema."""

        from_attributes = True


class MainBusinessLineSchema(BaseModel):
    """Pydantic schema for Main Business Line entity."""

    industry_code: Optional[int]
    industry_letter: Optional[str]
    industry: Optional[str]
    industry_description: Optional[str]
    registration_date: Optional[date]
    source: Optional[str]

    class Config:
        """Configuration for MainBusinessLineSchema."""

        from_attributes = True


class RegisteredEntrySchema(BaseModel):
    """Pydantic schema for Registered Entry entity."""

    registration_status_code: str
    registration_date: Optional[date]
    end_date: Optional[date]
    register_name: Optional[str]
    authority: Optional[str]

    class Config:
        """Configuration for RegisteredEntrySchema."""

        from_attributes = True


class CompanyFormSchema(BaseModel):
    """Pydantic schema for Company Form entity."""

    business_form: Optional[str]
    version: Optional[int]
    registration_date: Optional[date]
    end_date: Optional[date]
    source: Optional[str]

    class Config:
        """Configuration for CompanyFormSchema."""

        from_attributes = True


class PostOfficeSchema(BaseModel):
    """Pydantic schema for Post Office entity."""

    post_code: str
    city: Optional[str]
    municipality_code: Optional[int]
    active: Optional[bool]

    class Config:
        """Configuration for PostOfficeSchema."""

        from_attributes = True


class CompanySituationSchema(BaseModel):
    """Pydantic schema for Company Situation entity."""

    type: str
    registration_date: date
    source: Optional[str]

    class Config:
        """Configuration for CompanySituationSchema."""

        from_attributes = True


class BusinessData(BaseModel):
    """Pydantic schema for Business Data entity."""

    business_id: str
    street: Optional[str]
    building_number: Optional[str]
    entrance: Optional[str]
    postal_code: Optional[str]
    city: Optional[str]
    latitude_wgs84: Optional[str]
    longitude_wgs84: Optional[str]
    address_type: Optional[str]
    active: Optional[str]
    company_name: Optional[str]
    company_type: Optional[str]
    industry_description: Optional[str]
    industry_letter: Optional[str]
    industry: Optional[str]
    registration_date: Optional[str]
    website: Optional[str]

    class Config:
        """Configuration for BusinessData."""

        from_attributes = True
