from datetime import date
from typing import Optional

from pydantic import BaseModel


class AddressSchema(BaseModel):
    business_id: str
    type: str
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
