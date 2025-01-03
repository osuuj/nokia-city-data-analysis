CREATE TABLE IF NOT EXISTS companies (
        business_id VARCHAR(20) NOT NULL PRIMARY KEY,    -- Business ID
        website VARCHAR(255),                            -- Website URL    
        registration_date DATE,                          -- Date of registration
        trade_register_status VARCHAR(50),               -- Trade register status
        status VARCHAR(50),                              -- Status of the company      
        end_date DATE,                                   -- End date of the company
        last_modified DATE                               -- Last modified date
    );

CREATE TABLE IF NOT EXISTS names (
    id SERIAL PRIMARY KEY,                       
    business_id VARCHAR(20) NOT NULL,            -- Business ID
    name VARCHAR(255) NOT NULL,                  -- Name of the business
    type VARCHAR(50),                            -- Type of the name (e.g., legal, trade)
    registration_date DATE,                      -- Date when the name was registered
    end_date DATE,                               -- Date when the name was no longer valid
    version INT NOT NULL DEFAULT 1,              -- Version number for name changes
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
    post_code VARCHAR(10),                       -- Postal code
    post_office_box VARCHAR(50),                 -- P.O. Box
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
    type VARCHAR(255),                           -- Business line type or description
    type_code_set VARCHAR(50),                   -- Code set for categorizing the business line
    registration_date DATE,                      -- Date when the business line was registered
    source VARCHAR(255),                         -- Source of the business line information
    UNIQUE (business_id, type, type_code_set),   -- Ensure no duplicate entries for the same business line
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Maintain referential integrity
);

CREATE TABLE IF NOT EXISTS registered_entries (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    type VARCHAR(10) NOT NULL,                   -- Type of registered entry
    registration_date DATE,                      -- Date when the entry was registered
    end_date DATE,                               -- End date for the entry, if applicable
    register VARCHAR(255),                       -- The register in which the entry is recorded
    authority VARCHAR(255),                      -- Authority responsible for the entry
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Maintain referential integrity
);

CREATE TABLE IF NOT EXISTS registered_entry_descriptions (
    entry_type VARCHAR(10) PRIMARY KEY,          -- Type of registered entry, matches 'type' in registered_entries
    description VARCHAR(255) NOT NULL           -- Detailed description of the entry type
);

CREATE TABLE IF NOT EXISTS company_form_descriptions (
    type INT PRIMARY KEY,                        -- Type of company form (matches 'type' in company_forms)
    description VARCHAR(255) NOT NULL           -- Detailed description of the company form
);

CREATE TABLE IF NOT EXISTS company_forms (
    id SERIAL PRIMARY KEY,                       -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,            -- Business ID (foreign key to companies table)
    type INT NOT NULL,                           -- Type of company form (foreign key to company_form_descriptions table)
    registration_date DATE,                      -- Date when the company form was registered
    end_date DATE,                               -- End date for the company form, if applicable
    version INT,                                 -- Version of the company form
    source VARCHAR(255),                         -- Source of the company form information
    UNIQUE (business_id, type, version),         -- Prevent duplicate entries for the same company form version
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE, -- Link to companies table
    FOREIGN KEY (type) REFERENCES company_form_descriptions(type) -- Link to descriptions table
);

CREATE TABLE IF NOT EXISTS business_line_descriptions (
    id SERIAL PRIMARY KEY,                      -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,           -- Business ID (foreign key to companies table)
    language_code VARCHAR(5),                   -- Language code for the description (e.g., 'en', 'fi', 'sv')
    description VARCHAR(255) NOT NULL,          -- Description of the business line
    UNIQUE (business_id, language_code),        -- Ensure no duplicate descriptions for the same business in a language
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
    end_date DATE,                              -- Date when the situation ended (if applicable)
    source VARCHAR(255),                        -- Source of the situation information
    UNIQUE (business_id, type, registration_date), -- Ensure unique situations per business
    FOREIGN KEY (business_id) REFERENCES companies(business_id) ON DELETE CASCADE -- Link to companies table
);
