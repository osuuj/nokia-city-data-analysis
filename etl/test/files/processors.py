from etl.config.mappings import Mappings
from typing import List, Dict, Any
from etl.utils.helpers import filter_english_descriptions, handle_missing_values

def process_business_info(company: Dict[str, Any], business_info: List[Dict[str, Any]]) -> None:
    """Process business information."""
    business_id = company['businessId']['value']
    main_business_line = None
    if company.get('mainBusinessLine'):
        main_business_line = "; ".join(filter_english_descriptions(company['mainBusinessLine']['descriptions']))
    
    if not company.get('names') or not company['names'][0].get('name'):
        raise ValueError(f"Company with business_id {business_id} does not have a primary name.")
    
    business_id_status = Mappings.map_status(int(company.get('status')))
    website = company.get('website', "unknown")
    if isinstance(website, dict):
        website = website.get('url', "unknown")
    elif not website:
        website = "unknown"

    business_info.append(handle_missing_values({
        "business_id": business_id,
        "registration_date": company['businessId'].get('registrationDate'),
        "eu_id": company.get('euId', {}).get('value') if company.get('euId') else "unknown",
        "primary_name": company['names'][0]['name'],
        "main_business_line": main_business_line,
        "status": business_id_status,
        "end_date": company.get('endDate') if company.get('endDate') else "N/A",
        "last_modified": company.get('lastModified'),
        "website": website,
    }, {
        "registration_date": "N/A",
        "last_modified": "N/A"
    }))

def process_names_table(company: Dict[str, Any], names_table: List[Dict[str, Any]], business_name_history: List[Dict[str, Any]]) -> None:
    """Process names table."""
    business_id = company['businessId']['value']
    for name in company['names']:
        name_type = Mappings.map_name_type(int(name['type']))
        if name.get('endDate'):
            business_name_history.append({
                "business_id": business_id,
                "previous_name": name['name'],
                "new_name": name['name'],
                "change_date": name.get('endDate')
            })
        names_table.append(handle_missing_values({
            "business_id": business_id,
            "name": name['name'],
            "type": name_type,
            "registration_date": name.get('registrationDate'),
            "start_date": name.get('startDate'),
            "end_date": name.get('endDate') if name.get('endDate') else "N/A",
            "name_version": name.get('version'),
        }, {
            "registration_date": "N/A",
            "start_date": "N/A",
            "name_version": "N/A"
        }))

def process_company_forms(company: Dict[str, Any], company_forms_table: List[Dict[str, Any]]) -> None:
    """Process company forms table."""
    business_id = company['businessId']['value']
    for form in company.get('companyForms', []):
        company_forms_table.append(handle_missing_values({
            "business_id": business_id,
            "description": "; ".join(filter_english_descriptions(form['descriptions'])),
            "registration_date": form.get('registrationDate') if form.get('registrationDate') else "N/A",
            "end_date": form.get('endDate') if form.get('endDate') else "N/A",
        }, {
            "registration_date": "N/A",
            "end_date": "N/A"
        }))

def process_registered_entries(company: Dict[str, Any], registered_entries_table: List[Dict[str, Any]]) -> None:
    """Process registered entries table."""
    business_id = company['businessId']['value']
    for entry in company.get('registeredEntries', []):
        register = Mappings.map_register(int(entry['register']))
        authority = Mappings.map_authority(int(entry['authority']))
        registered_entries_table.append(handle_missing_values({
            "business_id": business_id,
            "description": "; ".join(filter_english_descriptions(entry['descriptions'])),
            "registration_date": entry.get('registrationDate') if entry.get('registrationDate') else "N/A",
            "register": register,
            "authority": authority,
        }, {
            "registration_date": "N/A"
        }))

def process_addresses(company: Dict[str, Any], addresses_table: List[Dict[str, Any]]) -> None:
    """Process addresses table."""
    business_id = company['businessId']['value']
    for address in company['addresses']:
        address_type = Mappings.map_address_type(int(address['type']))
        address = handle_missing_values(address, {
            'address': 'Unknown',
            'post_code': 'Unknown',
            'city': 'Unknown',
            'municipality_code': 'Unknown',
            'co': 'N/A',
            'country': 'FINLAND'
        })
        for post_office in address.get('postOffices', []):
            address['municipality_code'] = post_office.get('municipalityCode', address['municipality_code'])
            addresses_table.append({
                "business_id": business_id,
                "address_type": address_type,
                "address": address['address'],
                "building_number": address.get('buildingNumber', 'N/A'),
                "entrance": address.get('entrance', 'N/A'),
                "apartment_number": address.get('apartmentNumber', 'N/A'),
                "post_code": address['post_code'],
                "city": address['city'],
                "municipality_code": address['municipality_code'],
                "co": address['co'],
                "country": address['country'],
            })
