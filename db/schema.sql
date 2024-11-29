CREATE TABLE IF NOT EXISTS business_info (
    business_id VARCHAR(255) PRIMARY KEY,
    registration_date DATE,
    status VARCHAR(50),
    website VARCHAR(255),
    website_registered_date DATE,
    last_modified DATE
);

CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    address_type VARCHAR(50),
    street VARCHAR(255),
    building_number VARCHAR(50),
    apartment_number VARCHAR(50),
    post_code VARCHAR(50),
    city VARCHAR(255),
    city_id VARCHAR(50),
    co VARCHAR(255),
    start_date DATE,
    end_date DATE
);

CREATE TABLE IF NOT EXISTS business_name_history (
    id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    name VARCHAR(255),
    name_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN
);

CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    name VARCHAR(255),
    type VARCHAR(50),
    registration_date DATE,
    is_active BOOLEAN,
    start_date DATE,
    end_date DATE,
    business_description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS company_forms (
    form_id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    form_type VARCHAR(50),
    description VARCHAR(255),
    registration_date DATE,
    end_date DATE
);

CREATE TABLE IF NOT EXISTS registered_entries (
    id SERIAL PRIMARY KEY,
    business_id VARCHAR(255) REFERENCES business_info(business_id),
    description VARCHAR(255),
    registration_date DATE,
    register VARCHAR(255),
    authority VARCHAR(255),
    end_date DATE
);
