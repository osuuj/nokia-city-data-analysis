"""This module defines SQLAlchemy ORM models for database tables.

- Models include Company, Name, Address, and other related entities.
- Establishes relationships between tables using foreign keys.
- Ensures compatibility with Pydantic schemas using `orm_mode`.

"""

from typing import List

from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, relationship

from server.backend.database import Base


class Company(Base):
    """SQLAlchemy model for the `companies` table."""

    __tablename__ = "companies"

    business_id = Column(String(20), primary_key=True)
    website = Column(String(255))
    company_id_status = Column(String(50))
    trade_register_status = Column(String(50))
    registration_date = Column(Date)
    end_date = Column(Date)
    last_modified = Column(Date)

    names: Mapped[List["Name"]] = relationship(
        "Name", back_populates="company", cascade="all, delete"
    )
    addresses: Mapped[List["Address"]] = relationship(
        "Address", back_populates="company", cascade="all, delete"
    )
    main_business_lines: Mapped[List["MainBusinessLine"]] = relationship(
        "MainBusinessLine", back_populates="company", cascade="all, delete"
    )
    registered_entries: Mapped[List["RegisteredEntry"]] = relationship(
        "RegisteredEntry", back_populates="company", cascade="all, delete"
    )
    company_forms: Mapped[List["CompanyForm"]] = relationship(
        "CompanyForm", back_populates="company", cascade="all, delete"
    )
    post_offices: Mapped[List["PostOffice"]] = relationship(
        "PostOffice", back_populates="company", cascade="all, delete"
    )
    company_situations: Mapped[List["CompanySituation"]] = relationship(
        "CompanySituation", back_populates="company", cascade="all, delete"
    )


class Name(Base):
    """SQLAlchemy model for the `names` table."""

    __tablename__ = "names"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    company_name = Column(String(255), nullable=False)
    version = Column(Integer, nullable=False, default=1, primary_key=True)
    company_type = Column(String(50))
    registration_date = Column(Date)
    end_date = Column(Date)
    source = Column(String(255))

    company: Mapped["Company"] = relationship("Company", back_populates="names")


class Address(Base):
    """SQLAlchemy model for the `addresses` table."""

    __tablename__ = "addresses"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    type = Column(String(50), primary_key=True)
    street = Column(String(255))
    building_number = Column(String(50))
    entrance = Column(String(50))
    apartment_number = Column(String(50))
    apartment_id_suffix = Column(String(50))
    post_office_box = Column(String(50))
    post_code = Column(String(10))
    co = Column(String(255))
    country = Column(String(50), default="Unknown")
    free_address_line = Column(String(255))
    registration_date = Column(Date)
    source = Column(String(255))

    company: Mapped["Company"] = relationship("Company", back_populates="addresses")


class MainBusinessLine(Base):
    """SQLAlchemy model for the `main_business_lines` table."""

    __tablename__ = "main_business_lines"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    industry_code = Column(String(50), primary_key=True)
    industry = Column(String(255))
    industry_description = Column(String(255))
    registration_date = Column(Date)
    source = Column(String(255))

    company: Mapped["Company"] = relationship(
        "Company", back_populates="main_business_lines"
    )


class RegisteredEntry(Base):
    """SQLAlchemy model for the `registered_entries` table."""

    __tablename__ = "registered_entries"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    registration_status_code = Column(String(100), primary_key=True)
    registration_date = Column(Date)
    end_date = Column(Date)
    register_name = Column(String(255))
    authority = Column(String(255))

    company: Mapped["Company"] = relationship(
        "Company", back_populates="registered_entries"
    )


class CompanyForm(Base):
    """SQLAlchemy model for the `company_forms` table."""

    __tablename__ = "company_forms"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    business_form = Column(String(100))
    version = Column(Integer, primary_key=True)
    registration_date = Column(Date)
    end_date = Column(Date)
    source = Column(String(255))

    company: Mapped["Company"] = relationship("Company", back_populates="company_forms")


class PostOffice(Base):
    """SQLAlchemy model for the `post_offices` table."""

    __tablename__ = "post_offices"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    post_code = Column(String(10), primary_key=True)
    city = Column(String(100))
    municipality_code = Column(Integer)
    active = Column(Boolean, default=True)

    company: Mapped["Company"] = relationship("Company", back_populates="post_offices")


class CompanySituation(Base):
    """SQLAlchemy model for the `company_situations` table."""

    __tablename__ = "company_situations"

    business_id = Column(
        String(20),
        ForeignKey("companies.business_id", ondelete="CASCADE"),
        primary_key=True,
    )
    type = Column(String(100), primary_key=True)
    registration_date = Column(Date, primary_key=True)
    source = Column(String(255))

    company: Mapped["Company"] = relationship(
        "Company", back_populates="company_situations"
    )
