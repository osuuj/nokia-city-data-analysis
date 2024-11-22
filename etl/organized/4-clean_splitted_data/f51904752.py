import csv
import json
import os
from config import SPLIT_DIR, CLEANED_DIR, CITY

# Function to extract English descriptions only
def filter_english_descriptions(descriptions):
    return [desc['description'] for desc in descriptions if desc['languageCode'] == "3"]

# Ensure output directory exists
os.makedirs(CLEANED_DIR, exist_ok=True)

# Function to save tables to CSV
def save_to_csv(filename, data, headers):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)

# Function to map type numbers to descriptions
def map_name_type(type_number):
    type_mapping = {
        1: "Business Name (Sole Trader)",
        2: "Parallel Company Name",
        3: "Auxiliary Business Name",
        4: "Translation of Auxiliary Business Name"
    }
    return type_mapping.get(type_number, "Unknown")

# Function to map company form type numbers to descriptions
def map_company_form_type(type_number):
    type_mapping = {
        13: "Limited partnership",
        16: "Limited company",
        # Add other mappings as needed
    }
    return type_mapping.get(type_number, "Unknown")

# Function to map status numbers to descriptions
def map_status(status_number):
    status_mapping = {
        1: "Pending",
        2: "Active",
        3: "Business ID Deactivated"
    }
    return status_mapping.get(status_number, "Unknown")

# Function to process a single JSON file
def process_json_file(file_path, part):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Tables for export
    business_info = []
    names_table = []
    company_forms_table = []
    registered_entries_table = []
    addresses_table = []

    # Process each company
    for company in data:
        business_id = company['businessId']['value']
        
        # 1. Business Information
        main_business_line = None
        if company.get('mainBusinessLine'):
            main_business_line = "; ".join(filter_english_descriptions(company['mainBusinessLine']['descriptions']))
        
        business_info.append({
            "business_id": business_id,
            "registration_date": company['businessId'].get('registrationDate'),
            "eu_id": company.get('euId', {}).get('value') if company.get('euId') else None,
            "primary_name": company['names'][0]['name'] if company['names'] else None,
            "main_business_line": main_business_line,
            "status": map_status(company.get('status')),
            "registration_date": company.get('registrationDate'),
            "end_date": company.get('endDate'),
            "last_modified": company.get('lastModified'),
        })
        
        # 2. Names Table
        for name in company.get('names', []):
            names_table.append({
                "business_id": business_id,
                "name": name.get('name'),
                "type": map_name_type(name.get('type')),
                "registration_date": name.get('registrationDate'),
                "end_date": name.get('endDate'),
                "version": "Current" if name.get('version') == 1 else f"Version {name.get('version')}",
            })
        
        # 3. Company Forms Table
        for form in company.get('companyForms', []):
            company_forms_table.append({
                "business_id": business_id,
                "type": map_company_form_type(form.get('type')),
                "description": "; ".join(filter_english_descriptions(form.get('descriptions', []))),
                "registration_date": form.get('registrationDate'),
                "end_date": form.get('endDate'),
            })
        
        # 4. Registered Entries Table
        for entry in company.get('registeredEntries', []):
            registered_entries_table.append({
                "business_id": business_id,
                "type": entry.get('type'),
                "description": "; ".join(filter_english_descriptions(entry.get('descriptions', []))),
                "registration_date": entry.get('registrationDate'),
                "register": entry.get('register'),
                "authority": entry.get('authority'),
            })
        
        # 5. Addresses Table
        for address in company.get('addresses', []):
            for post_office in address.get('postOffices', []):
                if post_office.get('languageCode') == "3":  # English only
                    addresses_table.append({
                        "business_id": business_id,
                        "type": address.get('type'),
                        "street": address.get('street'),
                        "post_code": address.get('postCode'),
                        "city": post_office.get('city'),
                        "building_number": address.get('buildingNumber'),
                        "entrance": address.get('entrance'),
                        "apartment_number": address.get('apartmentNumber'),
                        "co": address.get('co'),
                        "country": address.get('country'),
                    })

    # Save tables to CSV
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_business_info.csv', business_info, [
        "business_id", "registration_date", "eu_id", "primary_name", 
        "main_business_line", "status", 
        "registration_date", "end_date", "last_modified"
    ])
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_names.csv', names_table, [
        "business_id", "name", "type", "registration_date", "end_date", "version"
    ])
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_company_forms.csv', company_forms_table, [
        "business_id", "type", "description", "registration_date", "end_date"
    ])
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_registered_entries.csv', registered_entries_table, [
        "business_id", "type", "description", "registration_date", "register", "authority"
    ])
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_addresses.csv', addresses_table, [
        "business_id", "type", "street", "post_code", "city", 
        "building_number", "entrance", "apartment_number", "co", "country"
    ])

# Iterate over all JSON files in the input directory
for part, filename in enumerate(os.listdir(SPLIT_DIR)):
    if filename.endswith('.json'):
        file_path = os.path.join(SPLIT_DIR, filename)
        process_json_file(file_path, part)