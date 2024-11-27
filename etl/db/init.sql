-- Table for core business information (unique per business)
CREATE TABLE IF NOT EXISTS business_info (
    business_id VARCHAR(255) PRIMARY KEY,
    registration_date DATE,
    eu_id VARCHAR(255),
    status VARCHAR(255),
    last_modified TIMESTAMP,
    website VARCHAR(255),
    -- other business-specific details that don't change
);

-- Table to store all business names over time (multiple names per business)
CREATE TABLE IF NOT EXISTS names_table (
    id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    name VARCHAR(255),
    type VARCHAR(255),
    registration_date DATE,
    is_active BOOLEAN DEFAULT TRUE, 
    start_date DATE,
    end_date DATE
);

-- Table to store all addresses (business can have multiple addresses across cities)
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    address_type VARCHAR(255),
    street VARCHAR(255),
    building_number VARCHAR(255),
    apartment_number VARCHAR(255),
    post_code VARCHAR(255),
    city_id VARCHAR(255),  -- Link to cities table
    country VARCHAR(255),
    co VARCHAR(255),
    start_date DATE,
    end_date DATE
);

-- Table for city information (if needed)
CREATE TABLE IF NOT EXISTS cities (
    city_id VARCHAR(255) PRIMARY KEY,
    city_name VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255)
);

-- Table to store company forms (multiple forms per business)
CREATE TABLE IF NOT EXISTS company_forms (
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    form_type VARCHAR(255),
    description VARCHAR(255),
    registration_date DATE,
    end_date DATE,
    PRIMARY KEY (business_id, form_type, registration_date)
);

-- Table to store registered entries (multiple registrations per business)
CREATE TABLE IF NOT EXISTS registered_entries (
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    description VARCHAR(255),
    registration_date DATE,
    register VARCHAR(255),
    authority VARCHAR(255),
    PRIMARY KEY (business_id, description, registration_date)
);

CREATE TABLE IF NOT EXISTS business_name_history (
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    name VARCHAR(255),
    name_type VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN,
    PRIMARY KEY (business_id, name, start_date)
);
