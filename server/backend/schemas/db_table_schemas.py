"""This module defines the Pydantic models for the Company and Address entities."""

from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class AddressBase(BaseModel):
    type: str
    street: str
    building_number: Optional[str]
    entrance: Optional[str]
    apartment_number: Optional[str]
    apartment_id_suffix: Optional[str]
    post_office_box: Optional[str]
    post_code: str
    co: Optional[str]
    country: Optional[str]
    free_address_line: Optional[str]
    registration_date: Optional[date]
    source: Optional[str]


class Address(AddressBase):
    pass


class NameBase(BaseModel):
    business_id: str
    company_name: str
    version: int
    company_type: Optional[str]
    registration_date: Optional[date]
    end_date: Optional[date]
    source: Optional[str]


class Name(NameBase):
    pass


class CompanyBase(BaseModel):
    business_id: str
    website: Optional[str]
    company_id_status: Optional[str]
    trade_register_status: Optional[str]
    registration_date: Optional[date]
    end_date: Optional[date]
    last_modified: Optional[date]


class Company(CompanyBase):
    names: List[Name] = []
    addresses: List[Address] = []
