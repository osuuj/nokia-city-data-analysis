CREATE TABLE businesses (
    business_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    company_type TEXT NOT NULL,
    registration_date DATE NOT NULL,
    end_date DATE NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL,
    version INT NOT NULL
);

CREATE TABLE business_name_history (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_type TEXT NOT NULL,
    registration_date DATE NOT NULL,
    end_date DATE NULL,
    source TEXT NOT NULL,
    version INT NOT NULL
);

CREATE TABLE addresses (
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
    type TEXT
);

CREATE TABLE industry_classifications (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    industry_code INT NOT NULL,
    industry TEXT NULL,
    industry_description TEXT NOT NULL,
    registration_date DATE NOT NULL,
    source TEXT NOT NULL
);

CREATE TABLE websites (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    website TEXT NOT NULL,
    last_modified DATE NULL,
    company_id_status TEXT NULL,
    trade_register_status TEXT NULL,
    registration_date DATE NULL,
    end_date DATE NULL
);

CREATE TABLE company_forms (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    business_form TEXT NOT NULL,
    registration_date DATE NULL,
    end_date DATE NULL,
    version INT,
    source TEXT NOT NULL
);

CREATE TABLE company_situations (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    situation_type TEXT CHECK (situation_type IN ('Bankrupt', 'Liquidation','Company Re-Organisation')),
    registration_date DATE NOT NULL,
    source TEXT NOT NULL
);

CREATE TABLE registered_entries (
    id SERIAL PRIMARY KEY,
    business_id TEXT REFERENCES businesses(business_id) ON DELETE CASCADE,
    registration_status_code TEXT NOT NULL,
    registration_date DATE NOT NULL,
    end_date DATE NULL,
    register_name TEXT NOT NULL,
    authority TEXT NOT NULL
);

CREATE INDEX idx_location ON addresses USING GIST (point(latitude_wgs84, longitude_wgs84));
CREATE INDEX idx_city ON addresses(city);
CREATE INDEX idx_industry ON industry_classifications(industry_code);
CREATE INDEX idx_website_business ON websites(business_id);
CREATE INDEX idx_company_forms_business ON company_forms(business_id);
