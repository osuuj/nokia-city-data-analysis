from pydantic import BaseModel

class AddressBase(BaseModel):
    street: str
    city: str
    postcode: str

class Address(AddressBase):
    latitude: float
    longitude: float

class CompanyBase(BaseModel):
    name: str
    business_type: str

class Company(CompanyBase):
    address: Address
