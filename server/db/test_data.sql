-- Basic test data for testing
-- Make sure we have something to test with

-- Insert test companies
INSERT INTO businesses (business_id, company_name, company_type, registration_date, active, source, version)
VALUES
    ('1234567-8', 'Test Company A', 'Limited Company', '2023-01-01', true, 'test', 1),
    ('9876543-2', 'Test Company B', 'Limited Company', '2023-01-02', true, 'test', 1),
    ('5555555-5', 'Test Company C', 'Limited Company', '2023-01-03', true, 'test', 1),
    ('7777777-7', 'Test Company D', 'Limited Company', '2023-01-04', true, 'test', 1);

-- Insert test addresses
INSERT INTO addresses (business_id, street, building_number, postal_code, municipality, city, latitude_wgs84, longitude_wgs84, active)
VALUES
    ('1234567-8', 'Test Street', '10', 00100, 1, 'Helsinki', 60.1699, 24.9384, true),
    ('9876543-2', 'Test Avenue', '20', 00200, 2, 'Espoo', 60.2052, 24.6522, true),
    ('5555555-5', 'Test Road', '30', 00300, 3, 'Tampere', 61.4978, 23.7610, true),
    ('7777777-7', 'Test Boulevard', '40', 00400, 4, 'Vantaa', 60.2934, 25.0378, true);

-- Insert test industry classifications
INSERT INTO industry_classifications (business_id, industry_code, industry_letter, industry, industry_description, registration_date, source)
VALUES
    ('1234567-8', 62010, 'J', 'Information and communication', 'Computer programming activities', '2023-01-01', 'test'),
    ('9876543-2', 70220, 'M', 'Professional activities', 'Business and management consultancy', '2023-01-02', 'test'),
    ('5555555-5', 41200, 'F', 'Construction', 'Construction of residential and non-residential buildings', '2023-01-03', 'test'),
    ('7777777-7', 85599, 'P', 'Education', 'Other education n.e.c.', '2023-01-04', 'test'); 