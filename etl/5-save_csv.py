import csv
import json
import os
from config import SPLIT_DIR, CLEANED_DIR, CITY
from mappings import Mappings

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
        main_business_line = None
        if company.get('mainBusinessLine'):
            main_business_line = "; ".join(filter_english_descriptions(company['mainBusinessLine']['descriptions']))
        
        if not company.get('names') or not company['names'][0].get('name'):
            raise ValueError(f"Company with business_id {business_id} does not have a primary name.")
        
        # Map the business_id_status
        business_id_status = company.get('status')
        business_id_status = Mappings.map_status(int(business_id_status))

        # Get website
        website = company.get('website', "unknown")
        if isinstance(website, dict):
            website = website.get('url', "unknown")
        elif not website:
            website = "unknown"

        business_info.append({
            "business_id": business_id,
            "registration_date": company['businessId'].get('registrationDate'),
            "eu_id": company.get('euId', {}).get('value') if company.get('euId') else "unknown",
            "primary_name": company['names'][0]['name'],
            "main_business_line": main_business_line,
            "status": business_id_status,
            "registration_date": company.get('registrationDate'),
            "end_date": company.get('endDate') if company.get('endDate') else "N/A",
            "last_modified": company.get('lastModified'),
            "website": website,
        })

        # 2. Names Table
        for name in company['names']:
            name_type = Mappings.map_name_type(int(name['type']))

            names_table.append({
                "business_id": business_id,
                "name": name['name'],
                "type": name_type,
                "registration_date": name.get('registrationDate'),
                "end_date": name.get('endDate') if name.get('endDate') else "N/A",
                "name_version": name.get('version'),
            })

        # 3. Company Forms Table
        for form in company.get('companyForms', []):
            company_forms_table.append({
                "business_id": business_id,
                "description": "; ".join(filter_english_descriptions(form['descriptions'])),
                "registration_date": form.get('registrationDate') if form.get('registrationDate') else "N/A",
                "end_date": form.get('endDate') if form.get('endDate') else "N/A",
            })

        # 4. Registered Entries Table
        for entry in company.get('registeredEntries', []):
            register = Mappings.map_register(int(entry['register']))
            authority = Mappings.map_authority(int(entry['authority']))
            
            registered_entries_table.append({
                "business_id": business_id,
                "description": "; ".join(filter_english_descriptions(entry['descriptions'])),
                "registration_date": entry.get('registrationDate') if entry.get('registrationDate') else "N/A",
                "register": register,
                "authority": authority,
            })

        # 5. Addresses Table
        for address in company['addresses']:
            address_type = Mappings.map_address_type(int(address['type']))
            municipality_code = address.get('municipalityCode')

            for post_office in address.get('postOffices', []):
                municipality_code = post_office.get('municipalityCode')
            
                addresses_table.append({
                    "business_id": business_id,
                    "address_type": address_type,
                    "address": address.get('street'),
                    "building_number": address.get('buildingNumber') if address.get('buildingNumber') else "N/A",
                    "entrance": address.get('entrance') if address.get('entrance') else "N/A", 
                    "apartment_number": address.get('apartmentNumber') if address.get('apartmentNumber') else "N/A",
                    "post_code": address.get('postCode'),
                    "city": post_office.get('city'),
                    "municipality_code": municipality_code,
                    "co": address.get('co') if address.get('co') else "N/A",
                    "country": "FINLAND",
                })

    # Save tables to CSV
    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_business_info.csv', business_info, [
        "business_id", "registration_date", "eu_id", "primary_name", 
        "main_business_line", "status", 
        "registration_date", "end_date", "last_modified",  "website"
    ])

    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_names.csv', names_table, [
        "business_id", "name", "type", "registration_date", "end_date", "name_version"
    ])

    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_company_forms.csv', company_forms_table, [
        "business_id", "description", "registration_date", "end_date"
    ])

    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_registered_entries.csv', registered_entries_table, [
        "business_id", "description", "registration_date", "register", "authority"
    ])

    save_to_csv(f'{CLEANED_DIR}/cleaned_{CITY}_part_{part}_addresses.csv', addresses_table, [
        "business_id", "address_type", "address", "building_number", "entrance", "apartment_number", "post_code", "city", "municipality_code", "co", "country"
    ])

def main():
    # Iterate over all JSON files in the input directory
    for part, filename in enumerate(os.listdir(SPLIT_DIR)):
        if filename.endswith('.json'):
            file_path = os.path.join(SPLIT_DIR, filename)
            process_json_file(file_path, part)

if __name__ == "__main__":
    main()
