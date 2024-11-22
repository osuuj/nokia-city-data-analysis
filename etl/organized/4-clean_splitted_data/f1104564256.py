import csv
import json

def filter_english_descriptions(descriptions):
    return [desc['description'] for desc in descriptions if desc['languageCode'] == "3"]

def extract_business_info(company):
    return {
        "business_id": company['businessId']['value'],
        "registration_date": company['businessId']['registrationDate'],
        "eu_id": company.get('euId', {}).get('value'),
        "primary_name": company['names'][0]['name'],
        "main_business_line": filter_english_descriptions(company['mainBusinessLine']['descriptions'])[0],
        "trade_register_status": company['tradeRegisterStatus'],
        "status": company['status'],
        "registration_date": company['registrationDate'],
        "end_date": company.get('endDate'),
        "last_modified": company['lastModified']
    }

def extract_names(company):
    return [
        {
            "business_id": company['businessId']['value'],
            "name": name['name'],
            "type": name['type'],
            "registration_date": name['registrationDate'],
            "end_date": name.get('endDate'),
            "version": name['version']
        }
        for name in company['names']
    ]

def extract_company_forms(company):
    return [
        {
            "business_id": company['businessId']['value'],
            "type": form['type'],
            "description": "; ".join(filter_english_descriptions(form['descriptions'])),
            "registration_date": form.get('registrationDate'),
            "end_date": form.get('endDate')
        }
        for form in company['companyForms']
    ]

def extract_registered_entries(company):
    return [
        {
            "business_id": company['businessId']['value'],
            "type": entry['type'],
            "description": "; ".join(filter_english_descriptions(entry['descriptions'])),
            "registration_date": entry.get('registrationDate'),
            "register": entry.get('register'),
            "authority": entry.get('authority')
        }
        for entry in company['registeredEntries']
    ]

def extract_addresses(company):
    return [
        {
            "business_id": company['businessId']['value'],
            "type": address['type'],
            "street": address.get('street'),
            "post_code": address.get('postCode'),
            "city": post_office['city'],
            "building_number": address.get('buildingNumber'),
            "entrance": address.get('entrance'),
            "apartment_number": address.get('apartmentNumber'),
            "co": address.get('co'),
            "country": address.get('country')
        }
        for address in company['addresses']
        for post_office in address.get('postOffices', [])
        if post_office['languageCode'] == "3"
    ]

def save_to_csv(filename, data, headers):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)

def process_company_data(company):
    business_info.append(extract_business_info(company))
    names_table.extend(extract_names(company))
    company_forms_table.extend(extract_company_forms(company))
    registered_entries_table.extend(extract_registered_entries(company))
    addresses_table.extend(extract_addresses(company))

# Load JSON data
with open('splitted_NOKIA_0.json', 'r', encoding='utf-8') as f:
    companies = json.load(f)

# Initialize tables
business_info = []
names_table = []
company_forms_table = []
registered_entries_table = []
addresses_table = []

# Process each company
for company in companies:
    process_company_data(company)

# Define headers for each table
save_to_csv('business_info.csv', business_info, [
    "business_id", "registration_date", "eu_id", "primary_name", 
    "main_business_line", "trade_register_status", "status", 
    "registration_date", "end_date", "last_modified"
])
save_to_csv('names.csv', names_table, [
    "business_id", "name", "type", "registration_date", "end_date", "version"
])
save_to_csv('company_forms.csv', company_forms_table, [
    "business_id", "type", "description", "registration_date", "end_date"
])
save_to_csv('registered_entries.csv', registered_entries_table, [
    "business_id", "type", "description", "registration_date", "register", "authority"
])
save_to_csv('addresses.csv', addresses_table, [
    "business_id", "type", "street", "post_code", "city", 
    "building_number", "entrance", "apartment_number", "co", "country"
])