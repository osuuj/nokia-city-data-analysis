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
        business_info.append({
            "business_id": business_id,
            "registration_date": company['businessId'].get('registrationDate'),
            "eu_id": company.get('euId', {}).get('value'),
            "primary_name": company['names'][0]['name'] if company['names'] else None,
            "main_business_line": "; ".join(filter_english_descriptions(company['mainBusinessLine']['descriptions'])),
            "trade_register_status": company.get('tradeRegisterStatus'),
            "status": company.get('status'),
            "registration_date": company.get('registrationDate'),
            "end_date": company.get('endDate'),
            "last_modified": company.get('lastModified'),
        })
        
        # 2. Names Table
        for name in company['names']:
            names_table.append({
                "business_id": business_id,
                "name": name['name'],
                "type": name['type'],
                "registration_date": name.get('registrationDate'),
                "end_date": name.get('endDate'),
                "version": name.get('version'),
            })
        
        # 3. Company Forms Table
        for form in company['companyForms']:
            company_forms_table.append({
                "business_id": business_id,
                "type": form['type'],
                "description": "; ".join(filter_english_descriptions(form['descriptions'])),
                "registration_date": form.get('registrationDate'),
                "end_date": form.get('endDate'),
            })
        
        # 4. Registered Entries Table
        for entry in company['registeredEntries']:
            registered_entries_table.append({
                "business_id": business_id,
                "type": entry['type'],
                "description": "; ".join(filter_english_descriptions(entry['descriptions'])),
                "registration_date": entry.get('registrationDate'),
                "register": entry.get('register'),
                "authority": entry.get('authority'),
            })
        
        # 5. Addresses Table
        for address in company['addresses']:
            for post_office in address.get('postOffices', []):
                if post_office['languageCode'] == "3":  # English only
                    addresses_table.append({
                        "business_id": business_id,
                        "type": address['type'],
                        "street": address.get('street'),
                        "post_code": address.get('postCode'),
                        "city": post_office['city'],
                        "building_number": address.get('buildingNumber'),
                        "entrance": address.get('entrance'),
                        "apartment_number": address.get('apartmentNumber'),
                        "co": address.get('co'),
                        "country": address.get('country'),
                    })

    # Save tables to CSV
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_business_info.csv', business_info, [
        "business_id", "registration_date", "eu_id", "primary_name", 
        "main_business_line", "trade_register_status", "status", 
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