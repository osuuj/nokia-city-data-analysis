
-- Table: businesses
CREATE TABLE businesses (
    business_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry_code TEXT NOT NULL,
    registration_date DATE,
    end_date DATE,
    active BOOLEAN DEFAULT TRUE
);

-- Indexes for fast queries
CREATE INDEX idx_businesses_industry ON businesses(industry_code);
CREATE INDEX idx_businesses_active ON businesses(active);

-- Table: addresses
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    street TEXT NOT NULL,
    building_number TEXT,
    entrance TEXT,
    postal_code TEXT NOT NULL,
    municipality TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude FLOAT,
    longitude FLOAT
);

-- Indexes for efficient querying and geospatial lookups
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code);
CREATE INDEX idx_addresses_location ON addresses USING GIST (ST_GeographyFromText('SRID=4326;POINT(' || longitude || ' ' || latitude || ')'));

-- Table: company_forms
CREATE TABLE company_forms (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    business_form TEXT NOT NULL,
    registration_date DATE,
    end_date DATE
);

-- Index for form queries
CREATE INDEX idx_company_forms_business_id ON company_forms(business_id);

-- Table: company_situations
CREATE TABLE company_situations (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    registration_date DATE
);

-- Index for quick filtering
CREATE INDEX idx_company_situations_business_id ON company_situations(business_id);
CREATE INDEX idx_company_situations_type ON company_situations(type);