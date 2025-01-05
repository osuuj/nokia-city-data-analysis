"""This module defines the Pydantic models for the Company and Address entities."""

from pydantic import BaseModel


class AddressBase(BaseModel):
    """Represents the base model for an address.

    Attributes:
        street (str): The street name of the address.
        city (str): The city of the address.
        postcode (str): The postal code of the address.
    """

    street: str
    city: str
    postcode: str


class Address(AddressBase):
    """Represents an address with additional geographical information.

    Attributes:
        latitude (float): The latitude of the address.
        longitude (float): The longitude of the address.
    """

    latitude: float
    longitude: float


class CompanyBase(BaseModel):
    """Represents the base model for a company.

    Attributes:
        name (str): The name of the company.
        business_type (str): The type of business of the company.
    """

    name: str
    business_type: str


class Company(CompanyBase):
    """Represents a company with an associated address.

    Attributes:
        address (Address): The address of the company.
    """

    address: Address
