"""This module defines Pydantic models for serialization and validation of API data.

- Models include Company, Address, Name, and other related entities.
- Uses `from_attributes` for compatibility with SQLAlchemy models.
- Ensures type-safety and clean validation logic.
"""

from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict


class AddressSchema(BaseModel):
    """Pydantic schema for Address entity."""

    street: str
    building_number: str
    entrance: Optional[str] = None
    apartment_number: Optional[str] = None
    postal_code: int
    municipality: int
    city: str
    country: str = "FI"
    latitude_wgs84: float
    longitude_wgs84: float
    address_type: Optional[str] = None
    co: Optional[str] = None
    registration_date: Optional[date] = None
    active: bool = True
    type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class NameSchema(BaseModel):
    """Pydantic schema for Name entity."""

    business_id: str
    company_name: str
    company_type: str
    registration_date: Optional[date] = None
    end_date: Optional[date] = None
    active: bool
    source: str
    version: int

    model_config = ConfigDict(from_attributes=True)


class MainBusinessLineSchema(BaseModel):
    """Pydantic schema for Main Business Line entity."""

    industry_code: int
    industry_letter: str
    industry: Optional[str] = None
    industry_description: str
    registration_date: date
    source: str

    model_config = ConfigDict(from_attributes=True)


class RegisteredEntrySchema(BaseModel):
    """Pydantic schema for Registered Entry entity."""

    registration_status_code: str
    registration_date: Optional[date] = None
    end_date: Optional[date] = None
    register_name: str
    authority: str

    model_config = ConfigDict(from_attributes=True)


class CompanyFormSchema(BaseModel):
    """Pydantic schema for Company Form entity."""

    business_form: str
    version: Optional[int] = None
    registration_date: Optional[date] = None
    end_date: Optional[date] = None
    source: str

    model_config = ConfigDict(from_attributes=True)


class WebsiteSchema(BaseModel):
    """Pydantic schema for Website entity."""

    website: str
    last_modified: Optional[date] = None
    company_id_status: Optional[str] = None
    trade_register_status: Optional[str] = None
    registration_date: Optional[date] = None
    end_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)


class CompanySituationSchema(BaseModel):
    """Pydantic schema for Company Situation entity."""

    situation_type: str
    registration_date: date
    source: str

    model_config = ConfigDict(from_attributes=True)


class BusinessData(BaseModel):
    """Pydantic schema for Business Data entity."""

    business_id: str
    street: Optional[str] = None
    building_number: Optional[str] = None
    entrance: Optional[str] = None
    postal_code: Optional[str] = None
    city: Optional[str] = None
    latitude_wgs84: float
    longitude_wgs84: float
    address_type: Optional[str] = None
    active: Optional[str] = None
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    industry_description: Optional[str] = None
    industry_letter: Optional[str] = None
    industry: Optional[str] = None
    registration_date: Optional[str] = None
    website: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CompanySchema(BaseModel):
    """Pydantic schema for Company entity."""

    business_id: str
    company_name: str
    company_type: str
    registration_date: Optional[date] = None
    end_date: Optional[date] = None
    active: bool = True
    source: str
    version: int

    model_config = ConfigDict(from_attributes=True)
