from sqlalchemy import Column, String, ForeignKey, Date, Integer, Text
from sqlalchemy.orm import relationship
from server.backend.database import Base

class Company(Base):
    __tablename__ = "companies"
    business_id = Column(String, primary_key=True, index=True)
    website = Column(Text, nullable=True)  # Use Text for longer strings like URLs
    registration_date = Column(Date, nullable=True)
    trade_register_status = Column(String, nullable=True)
    status = Column(String, nullable=True)
    end_date = Column(Date, nullable=True)
    last_modified = Column(Date, nullable=True)
    
    # Relationships
    addresses = relationship("Address", back_populates="company", cascade="all, delete-orphan")
    names = relationship("Name", back_populates="company", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"

    business_id = Column(String, ForeignKey("companies.business_id"), primary_key=True, index=True)
    type = Column(String, nullable=True)  # E.g., "Postal address"
    street = Column(String, nullable=True)
    building_number = Column(String, nullable=True)
    entrance = Column(String, nullable=True)
    apartment_number = Column(String, nullable=True)
    apartment_id_suffix = Column(String, nullable=True)
    post_office_box = Column(String, nullable=True)
    post_code = Column(String, nullable=True)
    co = Column(String, nullable=True)
    country = Column(String, nullable=True)
    free_address_line = Column(String, nullable=True)
    registration_date = Column(Date, nullable=True)
    source = Column(String, nullable=True)

    # Relationship back to Company
    company = relationship("Company", back_populates="addresses")

class Name(Base):
    __tablename__ = "names"

    business_id = Column(String, ForeignKey("companies.business_id"), primary_key=True, index=True)  # Use business_id as the primary key
    name = Column(String, nullable=False)  # Required for company name
    type = Column(String, nullable=True)  # E.g., "Company name"
    registration_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    version = Column(Integer, default=1, nullable=False)
    source = Column(String, nullable=True)

    company = relationship("Company", back_populates="names")
