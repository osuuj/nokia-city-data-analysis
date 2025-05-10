-- Schema for the Nokia City Data Analysis database

CREATE TABLE IF NOT EXISTS businesses (
    business_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    company_type TEXT NOT NULL,
    registration_date DATE,
    end_date DATE NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL,
    version INT NOT NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS business_name_history (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_type TEXT NOT NULL,
    registration_date DATE,
    end_date DATE NULL,
    active BOOLEAN NOT NULL,
    source TEXT NOT NULL,
    version INT NOT NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    street TEXT NOT NULL,
    building_number TEXT NOT NULL,
    entrance TEXT NULL,
    apartment_number TEXT NULL,
    postal_code INT NOT NULL,
    municipality INT NOT NULL,
    city TEXT NOT NULL,
    country TEXT DEFAULT 'FI' NOT NULL,
    latitude_wgs84 DOUBLE PRECISION NOT NULL,
    longitude_wgs84 DOUBLE PRECISION NOT NULL,
    address_type TEXT CHECK (address_type IN ('Postal address', 'Visiting address')),
    co TEXT NULL,
    registration_date DATE NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    type TEXT,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS industry_classifications (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    industry_code INT NOT NULL,
    industry_letter TEXT NOT NULL,
    industry TEXT NULL,
    industry_description TEXT NOT NULL,
    registration_date DATE NOT NULL,
    source TEXT NOT NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS websites (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    website TEXT NOT NULL,
    last_modified DATE NULL,
    company_id_status TEXT NULL,
    trade_register_status TEXT NULL,
    registration_date DATE NULL,
    end_date DATE NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS company_forms (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    business_form TEXT NOT NULL,
    registration_date DATE NULL,
    end_date DATE NULL,
    version INT,
    source TEXT NOT NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS company_situations (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    situation_type TEXT CHECK (situation_type IN ('Bankrupt', 'Liquidation','Company Re-Organisation')),
    registration_date DATE NOT NULL,
    source TEXT NOT NULL,
    snapshot_date DATE
);

CREATE TABLE IF NOT EXISTS registered_entries (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    registration_status_code TEXT NOT NULL,
    registration_date DATE NULL,
    end_date DATE NULL,
    register_name TEXT NOT NULL,
    authority TEXT NOT NULL,
    snapshot_date DATE
);

-- Optimized indexes for better query performance

-- Spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_location ON addresses USING GIST (point(latitude_wgs84, longitude_wgs84));

-- Indexes for common filtering operations
CREATE INDEX IF NOT EXISTS idx_city ON addresses(city);
CREATE INDEX IF NOT EXISTS idx_industry ON industry_classifications(industry_code);
CREATE INDEX IF NOT EXISTS idx_website_business ON websites(business_id);
CREATE INDEX IF NOT EXISTS idx_company_forms_business ON company_forms(business_id);

-- Indexes to speed up JOINs
CREATE INDEX IF NOT EXISTS idx_business_id_addresses ON addresses(business_id);
CREATE INDEX IF NOT EXISTS idx_business_id_industry ON industry_classifications(business_id);
CREATE INDEX IF NOT EXISTS idx_business_id_company_situations ON company_situations(business_id);
CREATE INDEX IF NOT EXISTS idx_business_id_registered_entries ON registered_entries(business_id);

-- Indexes to improve sorting by registration_date
CREATE INDEX IF NOT EXISTS idx_registration_date_industry ON industry_classifications(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_registration_date_websites ON websites(registration_date DESC);
CREATE INDEX IF NOT EXISTS idx_registration_date_registered_entries ON registered_entries(registration_date DESC);

-- Indexes to improve filtering by active status
CREATE INDEX IF NOT EXISTS idx_active_businesses ON businesses(active);
CREATE INDEX IF NOT EXISTS idx_active_addresses ON addresses(active);

-- Indexes for text search on company names
CREATE INDEX IF NOT EXISTS idx_company_name_trgm ON businesses USING GIN (company_name gin_trgm_ops);

-- Index for industry letter filtering (used in analytics)
CREATE INDEX IF NOT EXISTS idx_industry_letter ON industry_classifications(industry_letter); 