from typing import List, Optional

from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from typing_extensions import Annotated

from server.backend.database import Base


class Company(Base):
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
