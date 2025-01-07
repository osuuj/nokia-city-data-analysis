"""This module defines the SQLAlchemy models for the Company, Address, Name, MainBusinessLine, RegisteredEntry, CompanyForm, PostOffice, and CompanySituation entities."""

from datetime import date
from typing import List, Optional

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from typing_extensions import Annotated

from server.backend.database import Base


class Company(Base):
    """Represents a company entity with various attributes and relationships.

    Attributes:
        business_id (str): The unique business ID of the company.
        website (Optional[str]): The website URL of the company.
        company_id_status (Optional[str]): The company ID status.
        trade_register_status (Optional[str]): The trade register status of the company.
        registration_date (Optional[date]): The registration date of the company.
        end_date (Optional[date]): The end date of the company's operations.
        last_modified (Optional[date]): The last modified date of the company's information.
        addresses (List[Address]): The list of addresses associated with the company.
        names (List[Name]): The list of names associated with the company.
        main_business_lines (List[MainBusinessLine]): The list of main business lines associated with the company.
        registered_entries (List[RegisteredEntry]): The list of registered entries associated with the company.
        company_forms (List[CompanyForm]): The list of company forms associated with the company.
        post_offices (List[PostOffice]): The list of post offices associated with the company.
        company_situations (List[CompanySituation]): The list of company situations associated with the company.
    """

    __tablename__ = "companies"
    business_id: Annotated[str, Column(String(20), primary_key=True, index=True)]
    website: Annotated[Optional[str], Column(String(255), nullable=True)]
    company_id_status: Annotated[Optional[str], Column(String(50), nullable=True)]
    trade_register_status: Annotated[Optional[str], Column(String(50), nullable=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    end_date: Annotated[Optional[date], Column(Date, nullable=True)]
    last_modified: Annotated[Optional[date], Column(Date, nullable=True)]

    # Relationships
    addresses: Annotated[
        List["Address"],
        relationship("Address", back_populates="company", cascade="all, delete-orphan"),
    ]
    names: Annotated[
        List["Name"],
        relationship("Name", back_populates="company", cascade="all, delete-orphan"),
    ]
    main_business_lines: Annotated[
        List["MainBusinessLine"],
        relationship(
            "MainBusinessLine", back_populates="company", cascade="all, delete-orphan"
        ),
    ]
    registered_entries: Annotated[
        List["RegisteredEntry"],
        relationship(
            "RegisteredEntry", back_populates="company", cascade="all, delete-orphan"
        ),
    ]
    company_forms: Annotated[
        List["CompanyForm"],
        relationship(
            "CompanyForm", back_populates="company", cascade="all, delete-orphan"
        ),
    ]
    post_offices: Annotated[
        List["PostOffice"],
        relationship(
            "PostOffice", back_populates="company", cascade="all, delete-orphan"
        ),
    ]
    company_situations: Annotated[
        List["CompanySituation"],
        relationship(
            "CompanySituation", back_populates="company", cascade="all, delete-orphan"
        ),
    ]


class Name(Base):
    """Represents a name entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        company_name (str): The name of the company.
        version (int): The version of the name.
        company_type (Optional[str]): The type of the company.
        registration_date (Optional[date]): The registration date of the name.
        end_date (Optional[date]): The end date of the name.
        source (Optional[str]): The source of the name information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "names"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    company_name: Annotated[str, Column(String(255), primary_key=True)]
    version: Annotated[int, Column(Integer, primary_key=True, default=1)]
    company_type: Annotated[Optional[str], Column(String(50), nullable=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    end_date: Annotated[Optional[date], Column(Date, nullable=True)]
    source: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="names")
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
        registration_date (Optional[date]): The registration date of the address.
        source (Optional[str]): The source of the address information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "addresses"
    id: Annotated[int, Column(Integer, primary_key=True, autoincrement=True)]
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), index=True)
    ]
    type: Annotated[Optional[str], Column(String(50), nullable=True)]
    street: Annotated[Optional[str], Column(String(255), nullable=True)]
    building_number: Annotated[Optional[str], Column(String(50), nullable=True)]
    entrance: Annotated[Optional[str], Column(String(50), nullable=True)]
    apartment_number: Annotated[Optional[str], Column(String(50), nullable=True)]
    apartment_id_suffix: Annotated[Optional[str], Column(String(50), nullable=True)]
    post_office_box: Annotated[Optional[str], Column(String(50), nullable=True)]
    post_code: Annotated[Optional[str], Column(String(10), nullable=True)]
    co: Annotated[Optional[str], Column(String(255), nullable=True)]
    country: Annotated[
        Optional[str], Column(String(50), nullable=True, default="Unknown")
    ]
    free_address_line: Annotated[Optional[str], Column(String(255), nullable=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    source: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="addresses")
    ]


class MainBusinessLine(Base):
    """Represents a main business line entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        industry_code (str): The industry code.
        industry (Optional[str]): The industry name.
        industry_description (Optional[str]): The industry description.
        registration_date (Optional[date]): The registration date of the industry.
        source (Optional[str]): The source of the industry information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "main_business_lines"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    industry_code: Annotated[str, Column(String(50), primary_key=True)]
    industry: Annotated[Optional[str], Column(String(255), nullable=True)]
    industry_description: Annotated[Optional[str], Column(String(255), nullable=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    source: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"],
        relationship("Company", back_populates="main_business_lines"),
    ]


class RegisteredEntry(Base):
    """Represents a registered entry entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        registration_status_code (str): The registration status code.
        registration_date (Optional[date]): The registration date of the entry.
        end_date (Optional[date]): The end date of the entry.
        register (Optional[str]): The register name.
        authority (Optional[str]): The authority name.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "registered_entries"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    registration_status_code: Annotated[str, Column(String(100), primary_key=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    end_date: Annotated[Optional[date], Column(Date, nullable=True)]
    register: Annotated[Optional[str], Column(String(255), nullable=True)]
    authority: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"],
        relationship("Company", back_populates="registered_entries"),
    ]


class CompanyForm(Base):
    """Represents a company form entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        business_form (Optional[str]): The business form.
        version (int): The version of the form.
        registration_date (Optional[date]): The registration date of the form.
        end_date (Optional[date]): The end date of the form.
        source (Optional[str]): The source of the form information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "company_forms"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    business_form: Annotated[Optional[str], Column(String(100), primary_key=True)]
    version: Annotated[int, Column(Integer, primary_key=True)]
    registration_date: Annotated[Optional[date], Column(Date, nullable=True)]
    end_date: Annotated[Optional[date], Column(Date, nullable=True)]
    source: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="company_forms")
    ]


class PostOffice(Base):
    """Represents a post office entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        post_code (str): The postal code.
        city (Optional[str]): The city name.
        municipality_code (Optional[int]): The municipality code.
        active (Optional[bool]): The active status of the post office.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "post_offices"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    post_code: Annotated[str, Column(String(10), primary_key=True)]
    city: Annotated[Optional[str], Column(String(100), nullable=True)]
    municipality_code: Annotated[Optional[int], Column(Integer, nullable=True)]
    active: Annotated[Optional[bool], Column(Boolean, default=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"], relationship("Company", back_populates="post_offices")
    ]


class CompanySituation(Base):
    """Represents a company situation entity associated with a company.

    Attributes:
        business_id (str): The business ID of the associated company.
        type (str): The type of situation.
        registration_date (date): The registration date of the situation.
        source (Optional[str]): The source of the situation information.
        company (Optional[Company]): The associated company entity.
    """

    __tablename__ = "company_situations"
    business_id: Annotated[
        str, Column(String(20), ForeignKey("companies.business_id"), primary_key=True)
    ]
    type: Annotated[str, Column(String(100), primary_key=True)]
    registration_date: Annotated[date, Column(Date, primary_key=True)]
    source: Annotated[Optional[str], Column(String(255), nullable=True)]

    # Relationship back to Company
    company: Annotated[
        Optional["Company"],
        relationship("Company", back_populates="company_situations"),
    ]
