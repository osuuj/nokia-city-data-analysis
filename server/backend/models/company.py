"""This module defines the SQLAlchemy models for the Company, Address, and Name entities."""

from typing import List, Optional

from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from typing_extensions import Annotated

from server.backend.database import Base


class Company(Base):
    """Represents a company entity with various attributes and relationships.

    Attributes:
        business_id (str): The unique business ID of the company.
        website (Optional[str]): The website URL of the company.
        registration_date (Optional[Date]): The registration date of the company.
        trade_register_status (Optional[str]): The trade register status of the company.
        status (Optional[str]): The current status of the company.
        end_date (Optional[Date]): The end date of the company's operations.
        last_modified (Optional[Date]): The last modified date of the company's information.
        addresses (List[Address]): The list of addresses associated with the company.
        names (List[Name]): The list of names associated with the company.
    """

    __tablename__ = "companies"
    business_id: Annotated[str, Column(String(20), primary_key=True, index=True)]
    website: Annotated[
        Optional[str], Column(Text, nullable=True)
    ]  # Use Text for longer strings like URLs
    registration_date: Annotated[Optional[Date], Column(Date, nullable=True)]
    trade_register_status: Annotated[Optional[str], Column(String, nullable=True)]
    status: Annotated[Optional[str], Column(String, nullable=True)]
    end_date: Annotated[Optional[Date], Column(Date, nullable=True)]
    last_modified: Annotated[Optional[Date], Column(Date, nullable=True)]

    # Relationships
    addresses: Annotated[
        List["Address"],
        relationship("Address", back_populates="company", cascade="all, delete-orphan"),
    ]
    names: Annotated[
        List["Name"],
        relationship("Name", back_populates="company", cascade="all, delete-orphan"),
    ]


class Address(Base):
    """Represents an address entity associated with a company.

    Attributes:
        id (int): The unique ID of the address.
        business_id (str): The business ID of the associated company.
        type (Optional[str]): The type of address (e.g., "Postal address").
        street (Optional[str]): The street name of the address.
        building_number (Optional[str]): The building number of the address.
        entrance (Optional[str]): The entrance of the address.
        apartment_number (Optional[str]): The apartment number of the address.
        apartment_id_suffix (Optional[str]): The apartment ID suffix of the address.
        post_office_box (Optional[str]): The post office box of the address.
        post_code (Optional[str]): The postal code of the address.
        co (Optional[str]): The care of (c/o) address line.
        country (Optional[str]): The country of the address.
        free_address_line (Optional[str]): The free address line.
        registration_date (Optional[Date]): The registration date of the address.
        source (Optional[str]): The source of the address information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "addresses"

    id: Annotated[int, Column(Integer, primary_key=True, autoincrement=True)]
    business_id: Annotated[
        str, Column(String, ForeignKey("companies.business_id"), index=True)
    ]
    type: Annotated[
        Optional[str], Column(String, nullable=True)
    ]  # E.g., "Postal address"
    street: Annotated[Optional[str], Column(String, nullable=True)]
    building_number: Annotated[Optional[str], Column(String, nullable=True)]
    entrance: Annotated[Optional[str], Column(String, nullable=True)]
    apartment_number: Annotated[Optional[str], Column(String, nullable=True)]
    apartment_id_suffix: Annotated[Optional[str], Column(String, nullable=True)]
    post_office_box: Annotated[Optional[str], Column(String, nullable=True)]
    post_code: Annotated[Optional[str], Column(String, nullable=True)]
    co: Annotated[Optional[str], Column(String, nullable=True)]
    country: Annotated[Optional[str], Column(String, nullable=True)]
    free_address_line: Annotated[Optional[str], Column(String, nullable=True)]
    registration_date: Annotated[Optional[Date], Column(Date, nullable=True)]
    source: Annotated[Optional[str], Column(String, nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="addresses")
    ]


class Name(Base):
    """Represents a name entity associated with a company.

    Attributes:
        id (int): The unique ID of the name.
        business_id (str): The business ID of the associated company.
        name (str): The name of the company.
        type (Optional[str]): The type of name (e.g., "Company name").
        registration_date (Optional[Date]): The registration date of the name.
        end_date (Optional[Date]): The end date of the name.
        version (int): The version of the name.
        source (Optional[str]): The source of the name information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "names"

    id: Annotated[int, Column(Integer, primary_key=True, autoincrement=True)]
    business_id: Annotated[
        str, Column(String, ForeignKey("companies.business_id"), index=True)
    ]
    name: Annotated[str, Column(String, nullable=False)]  # Required for company name
    type: Annotated[
        Optional[str], Column(String, nullable=True)
    ]  # E.g., "Company name"
    registration_date: Annotated[Optional[Date], Column(Date, nullable=True)]
    end_date: Annotated[Optional[Date], Column(Date, nullable=True)]
    version: Annotated[int, Column(Integer, default=1, nullable=False)]
    source: Annotated[Optional[str], Column(String, nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="names")
    ]
