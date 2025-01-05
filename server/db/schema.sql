CREATE TABLE IF NOT EXISTS companies (
        business_id VARCHAR(20) NOT NULL PRIMARY KEY,    -- Business ID
        website VARCHAR(255),                            -- Website URL    
        company_id_status VARCHAR(50),                   -- Status of the company
        trade_register_status VARCHAR(50),               -- Trade register status
        registration_date DATE,                          -- Date of registration
        end_date DATE,                                   -- End date of the company
        last_modified DATE                               -- Last modified date
);

CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,                       
    business_id VARCHAR(20) NOT NULL,            -- Business ID
    company_name VARCHAR(255) NOT NULL,                  -- Name of the business
    version INT NOT NULL DEFAULT 1,              -- Version number for name changes
    company_type VARCHAR(50),                            -- Type of the name (e.g., legal, trade)
    registration_date DATE,                      -- Date when the name was registered
    end_date DATE,                               -- Date when the name was no longer valid
    source VARCHAR(255),                          -- Source of the name information
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    type VARCHAR(50),                            -- Type of address (e.g., physical, mailing)
    street VARCHAR(255),                         -- Street name
    building_number VARCHAR(50),                 -- Building number
    entrance VARCHAR(50),                        -- Entrance details
    apartment_number VARCHAR(50),                -- Apartment number
    apartment_id_suffix VARCHAR(50),             -- Additional suffix for apartment ID
    post_office_box VARCHAR(50),                 -- P.O. Box
    post_code VARCHAR(10),                       -- Postal code
    co VARCHAR(255),                             -- Care of (c/o) field
    country VARCHAR(50) DEFAULT 'Unknown',       -- Country, defaulting to 'Unknown' if not provided
    free_address_line VARCHAR(255),              -- Free-form address line
    registration_date DATE,                      -- Date when the address was registered
    source VARCHAR(255),                         -- Source of the address information
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Reference to companies table
);

CREATE TABLE IF NOT EXISTS main_business_lines (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    industry_code VARCHAR(50),                   -- Code set for categorizing the business line
    industry VARCHAR(255),                       -- Industry code or description
    industry_description VARCHAR(255),                           -- Business line type or description
    registration_date DATE,                      -- Date when the business line was registered
    source VARCHAR(255),                         -- Source of the business line information
    UNIQUE (business_id, industry_code),   -- Ensure no duplicate entries for the same business line
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Maintain referential integrity
);

CREATE TABLE IF NOT EXISTS registered_entries (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    registration_status_code VARCHAR(100) NOT NULL,  -- Type of registered entry
    registration_date DATE,                      -- Date when the entry was registered
    end_date DATE,                               -- End date for the entry, if applicable
    register VARCHAR(255),                       -- The register in which the entry is recorded
    authority VARCHAR(255),                      -- Authority responsible for the entry
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Maintain referential integrity
);

CREATE TABLE IF NOT EXISTS company_forms (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    business_form VARCHAR(100),                   -- Type of company form (e.g., "Ltd", "PLC")
    version INT,                                 -- Version of the company form
    registration_date DATE,                      -- Date when the company form was registered
    end_date DATE,                               -- End date for the company form, if applicable
    source VARCHAR(255),                         -- Source of the company form information
    UNIQUE (business_id, business_form, version),         -- Prevent duplicate entries for the same company form version
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Link to companies table
);


CREATE TABLE IF NOT EXISTS post_offices (
    id SERIAL PRIMARY KEY,                      -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,           -- Business ID (foreign key to companies table)
    post_code VARCHAR(10) NOT NULL,             -- Postcode for the post office
    city VARCHAR(100),                          -- City where the post office is located
    municipality_code INT,                      -- Municipality code for the location
    active BOOLEAN DEFAULT TRUE,                -- Whether the post office is currently active
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Link to companies table
);

CREATE TABLE IF NOT EXISTS company_situations (
    id SERIAL PRIMARY KEY,                      -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,           -- Business ID (foreign key to companies table)
    type VARCHAR(100) NOT NULL,                 -- Type of situation (e.g., "Bankruptcy", "Merger")
    registration_date DATE NOT NULL,            -- Date when the situation was registered
    source VARCHAR(255),                        -- Source of the situation information
    UNIQUE (business_id, type, registration_date), -- Ensure unique situations per business
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Link to companies table
);
