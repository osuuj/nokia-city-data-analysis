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
    company_name = Column(Text, nullable=False)
    company_type = Column(Text, nullable=False)
    registration_date = Column(Date)
    end_date = Column(Date)
    active = Column(Boolean, nullable=False, default=True)
    source = Column(Text, nullable=False)
    version = Column(Integer, nullable=False)
    snapshot_date = Column(Date)


class Name(Base):
    __tablename__ = "business_name_history"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    company_name = Column(Text, nullable=False)
    company_type = Column(Text, nullable=False)
    registration_date = Column(Date)
    end_date = Column(Date)
    active = Column(Boolean, nullable=False)
    source = Column(Text, nullable=False)
    version = Column(Integer, nullable=False)
    snapshot_date = Column(Date)


class Address(Base):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    street = Column(Text, nullable=False)
    building_number = Column(Text, nullable=False)
    entrance = Column(Text)
    apartment_number = Column(Text)
    postal_code = Column(Integer, nullable=False)
    municipality = Column(Integer, nullable=False)
    city = Column(Text, nullable=False)
    country = Column(Text, default="FI", nullable=False)
    latitude_wgs84 = Column(Float, nullable=False)
    longitude_wgs84 = Column(Float, nullable=False)
    address_type = Column(Text)
    co = Column(Text)
    registration_date = Column(Date)
    active = Column(Boolean, nullable=False, default=True)
    type = Column(Text)
    snapshot_date = Column(Date)


class IndustryClassification(Base):
    __tablename__ = "industry_classifications"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    industry_code = Column(Integer, nullable=False)
    industry_letter = Column(Text, nullable=False)
    industry = Column(Text)
    industry_description = Column(Text, nullable=False)
    registration_date = Column(Date, nullable=False)
    source = Column(Text, nullable=False)
    snapshot_date = Column(Date)


class Website(Base):
    __tablename__ = "websites"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    website = Column(Text, nullable=False)
    last_modified = Column(Date)
    company_id_status = Column(Text)
    trade_register_status = Column(Text)
    registration_date = Column(Date)
    end_date = Column(Date)
    snapshot_date = Column(Date)


class CompanyForm(Base):
    __tablename__ = "company_forms"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    business_form = Column(Text, nullable=False)
    registration_date = Column(Date)
    end_date = Column(Date)
    version = Column(Integer)
    source = Column(Text, nullable=False)
    snapshot_date = Column(Date)


class CompanySituation(Base):
    __tablename__ = "company_situations"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    situation_type = Column(Text)
    registration_date = Column(Date, nullable=False)
    source = Column(Text, nullable=False)
    snapshot_date = Column(Date)


class RegisteredEntry(Base):
    __tablename__ = "registered_entries"
    id = Column(Integer, primary_key=True, autoincrement=True)
    business_id = Column(Text, ForeignKey("businesses.business_id"), nullable=False)
    registration_status_code = Column(Text, nullable=False)
    registration_date = Column(Date)
    end_date = Column(Date)
    register_name = Column(Text, nullable=False)
    authority = Column(Text, nullable=False)
    snapshot_date = Column(Date)
