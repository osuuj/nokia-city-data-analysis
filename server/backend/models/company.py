"""This module defines SQLAlchemy ORM models for database tables.

- Models include Company, Name, Address, and other related entities.
- Establishes relationships between tables using foreign keys.
- Ensures compatibility with Pydantic schemas using `orm_mode`.

"""

from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Company(Base):
    __tablename__ = "businesses"
    business_id = Column(Text, primary_key=True)
    # Add missing columns from schema.sql if needed by queries
    company_name = Column(Text)
    company_type = Column(Text)
    registration_date = Column(Date)
    end_date = Column(Date)
    active = Column(Boolean, nullable=False, default=True)  # Add missing active column
    source = Column(Text)
    version = Column(Integer, nullable=False)
    # Add other fields and relationships as needed


class Name(Base):
    __tablename__ = "business_name_history"
    id = Column(Integer, primary_key=True, autoincrement=True)
    version = Column(Integer, nullable=False)
    # Add other fields and relationships as needed


class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    type = Column(Text)
    # Add other fields and relationships as needed
    street = Column(Text)
    building_number = Column(Text)
    postal_code = Column(Integer)
    city = Column(Text)
    latitude_wgs84 = Column(Float)
    longitude_wgs84 = Column(Float)
    address_type = Column(Text)
    active = Column(Boolean)


class MainBusinessLine(Base):
    __tablename__ = "industry_classifications"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    source = Column(Text, nullable=False)
    industry_code = Column(Integer, nullable=False)
    industry_letter = Column(Text, nullable=False)
    industry = Column(Text, nullable=True)
    industry_description = Column(Text, nullable=False)
    registration_date = Column(Date, nullable=False)
    # Add other fields and relationships as needed


class Website(Base):
    __tablename__ = "websites"
    id = Column(Integer, primary_key=True, autoincrement=True)
    end_date = Column(Date, nullable=True)
    # Add other fields and relationships as needed


class CompanyForm(Base):
    __tablename__ = "company_forms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    source = Column(Text, nullable=False)
    # Add other fields and relationships as needed


class CompanySituation(Base):
    __tablename__ = "company_situations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    # Add other fields and relationships as needed
