import pandas as pd
import os
import json
import logging

logger = logging.getLogger(__name__)

def save_to_csv_in_chunks(df, output_base_name, chunk_size=2500):
    """
    Save a large DataFrame to multiple CSV files in chunks.

    :param df: DataFrame to be saved
    :param output_base_name: Base file name for output (e.g., 'companies')
    :param chunk_size: Number of rows per chunk
    """
    num_chunks = len(df) // chunk_size + 1
    for i in range(num_chunks):
        chunk = df[i * chunk_size: (i + 1) * chunk_size]
        chunk_file_name = f"{output_base_name}_part{i + 1}.csv"
        chunk.to_csv(chunk_file_name, index=False, encoding='utf-8')

def process_json_directory(directory_path):
    all_rows = []
    for file_name in os.listdir(directory_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(directory_path, file_name)
            with open(file_path, 'r', encoding='utf-8') as file:
                try:
                    data = json.load(file)
                    if not isinstance(data, list):
                        logger.error(f"Expected a list but got {type(data)}: {data}")
                        continue
                    all_rows.extend(data)
                except json.JSONDecodeError as e:
                    logger.error(f"Error decoding JSON from file {file_path}: {e}")
    return pd.DataFrame(all_rows)

# Extract company data
def extract_companies(data):
    logger.info("Starting extraction of companies data")
    rows = []
    for index, company in enumerate(data):
        if not isinstance(company, dict):
            logger.error(f"Expected a dictionary but got {type(company)} at index {index}: {company}")
            continue

        try:
            business_id = company.get('businessId')
            if isinstance(business_id, dict):
                business_id_value = business_id.get('value', None)
                registration_date = business_id.get('registrationDate', '')
            elif isinstance(business_id, str):
                business_id_value = business_id
                registration_date = company.get('registrationDate', '')
            else:
                logger.error(f"Unexpected type for businessId at index {index}: {type(business_id)}")
                continue

            if not business_id_value:
                continue

            rows.append({
                "businessId": business_id_value,
                "registrationDate": registration_date,
                "tradeRegisterStatus": company.get('tradeRegisterStatus', ''),
                "status": company.get('status', ''),
                "registrationDateCompany": company.get('registrationDate', ''),
                "endDate": company.get('endDate', ''),
                "lastModified": company.get('lastModified', '')
            })
        except AttributeError as e:
            logger.error(f"AttributeError at index {index} for company: {company} - {e}")
        except Exception as e:
            logger.error(f"Unexpected error at index {index} for company: {company} - {e}")
    return rows

def extract_names(data):
    logger.info("Starting extraction of names data")
    rows = []
    for index, company in enumerate(data):
        if not isinstance(company, dict):
            logger.error(f"Expected a dictionary but got {type(company)} at index {index}: {company}")
            continue
        
        try:
            # Extract businessId
            business_id = company.get('businessId')
            if isinstance(business_id, dict):
                business_id_value = business_id.get('value', None)
            elif isinstance(business_id, str):
                business_id_value = business_id
            else:
                logger.error(f"Unexpected type for businessId at index {index}: {type(business_id)}")
                continue

            if not business_id_value:
                continue

            # Extract names
            names = company.get('names', [])
            if not isinstance(names, list):
                logger.error(f"Expected a list for names but got {type(names)} at index {index}: {names}")
                continue

            if not names:
                continue

            # Process each name entry
            for name_index, name_entry in enumerate(names):
                if not isinstance(name_entry, dict):
                    logger.error(f"Invalid name_entry type at index {index}, name index {name_index}: {name_entry}")
                    continue

                # Append processed data
                rows.append({
                    "businessId": business_id_value,
                    "name": name_entry.get('name', '').strip(),
                    "type": name_entry.get('type', ''),
                    "registrationDate": name_entry.get('registrationDate', ''),
                    "endDate": name_entry.get('endDate', None),
                    "version": name_entry.get('version', 0),
                    "source": name_entry.get('source', '')
                })

        except Exception as e:
            logger.error(f"Unexpected error at index {index} for company: {company} - {e}")
    
    if not rows:
        logger.warning("No data extracted for names")
    return rows

def extract_main_business_lines(data):
    logger.info("Starting extraction of main business lines data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        main_business_line = company.get('mainBusinessLine', {})
        if main_business_line:
            rows.append({
                "businessId": business_id,
                "type": main_business_line.get('type', ''),
                "typeCodeSet": main_business_line.get('typeCodeSet', ''),
                "registrationDate": main_business_line.get('registrationDate', ''),
                "source": main_business_line.get('source', '')
            })
    return rows

def extract_business_line_descriptions(data):
    logger.info("Starting extraction of business line descriptions data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        main_business_line = company.get('mainBusinessLine', None)
        if main_business_line is None:
            continue  # Skip if mainBusinessLine is None
        
        descriptions = main_business_line.get('descriptions', [])
        for desc in descriptions:
            if not isinstance(desc, dict):
                logger.error(f"Invalid description entry at index {index}: {desc}")
                continue
            
            rows.append({
                "businessId": business_id,
                "languageCode": desc.get('languageCode', ''),
                "description": desc.get('description', '')
            })
    return rows

def extract_company_forms(data):
    logger.info("Starting extraction of company forms data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for form in company.get('companyForms', []):
            if not isinstance(form, dict):
                logger.error(f"Invalid company form entry at index {index}: {form}")
                continue
            
            rows.append({
                "businessId": business_id,
                "type": form.get('type', ''),
                "registrationDate": form.get('registrationDate', ''),
                "endDate": form.get('endDate', None),
                "version": form.get('version', 0),
                "source": form.get('source', '')
            })
    return rows

def extract_company_form_descriptions(data):
    logger.info("Starting extraction of company form descriptions data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for form in company.get('companyForms', []):
            if not isinstance(form, dict):
                logger.error(f"Invalid company form entry at index {index}: {form}")
                continue
            
            descriptions = form.get('descriptions', [])
            for desc in descriptions:
                if not isinstance(desc, dict):
                    logger.error(f"Invalid description entry at index {index}: {desc}")
                    continue
                
                rows.append({
                    "businessId": business_id,
                    "formType": form.get('type', ''),
                    "languageCode": desc.get('languageCode', ''),
                    "description": desc.get('description', '')
                })

    return rows

def extract_registered_entries(data):
    logger.info("Starting extraction of registered entries data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for entry in company.get('registeredEntries', []):
            if not isinstance(entry, dict):
                logger.error(f"Invalid registered entry at index {index}: {entry}")
                continue
            
            rows.append({
                "businessId": business_id,
                "type": entry.get('type', ''),
                "registrationDate": entry.get('registrationDate', ''),
                "endDate": entry.get('endDate', None),
                "register": entry.get('register', ''),
                "authority": entry.get('authority', ''),
                "source": entry.get('source', '')
            })
 
    return rows

def extract_company_situations(data):
    logger.info("Starting extraction of company situations data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for situation in company.get('companySituations', []):
            if not isinstance(situation, dict):
                logger.error(f"Invalid company situation entry at index {index}: {situation}")
                continue
            
            rows.append({
                "businessId": business_id,
                "type": situation.get('type', ''),
                "registrationDate": situation.get('registrationDate', ''),
                "endDate": situation.get('endDate', None),
                "source": situation.get('source', '')
            })
    return rows

def extract_registered_entry_descriptions(data):
    logger.info("Starting extraction of registered entry descriptions data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for entry in company.get('registeredEntries', []):
            if not isinstance(entry, dict):
                logger.error(f"Invalid registered entry at index {index}: {entry}")
                continue
            
            descriptions = entry.get('descriptions', [])
            for desc in descriptions:
                rows.append({
                    "businessId": business_id,
                    "entryType": entry.get('type', ''),
                    "languageCode": desc.get('languageCode', ''),
                    "description": desc.get('description', '')
                })
    return rows

def extract_addresses(data):
    logger.info("Starting extraction of addresses data")
    rows = []
    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for address in company.get('addresses', []):
            if not isinstance(address, dict):
                logger.error(f"Invalid address entry at index {index}: {address}")
                continue
            
            rows.append({
                "businessId": business_id,
                "type": address.get('type', ''),
                "street": address.get('street', ''),
                "postCode": address.get('postCode', ''),
                "city": address.get('city', ''),
                "country": address.get('country', ''),
                "registrationDate": address.get('registrationDate', ''),
                "endDate": address.get('endDate', None),
                "version": address.get('version', 0),
                "source": address.get('source', '')
            })
    return rows

def extract_post_offices(data):
    """
    Extract post office details from the input data.

    :param data: List of company records
    :return: List of post office records
    """
    logger.info("Starting extraction of post offices data")
    rows = []

    for index, company in enumerate(data):
        business_id = company.get('businessId', {}).get('value')
        if not business_id:
            logger.debug(f"No businessId found for company at index {index}")
            continue

        addresses = company.get('addresses', [])
        if not isinstance(addresses, list):
            logger.error(f"Invalid addresses type for company at index {index}: {type(addresses)}")
            continue

        for address in addresses:
            post_offices = address.get('postOffices', [])
            if not isinstance(post_offices, list) or not post_offices:
                continue

            for post_office in post_offices:
                if not isinstance(post_office, dict):
                    logger.error(f"Invalid post office entry for company with businessId {business_id}: {post_office}")
                    continue

                rows.append({
                    "businessId": business_id,
                    "postCode": post_office.get('postCode', ''),
                    "city": post_office.get('city', ''),
                    "active": post_office.get('active', ''),
                    "languageCode": post_office.get('languageCode', ''),
                    "municipalityCode": post_office.get('municipalityCode', '')
                })

    if not rows:
        logger.warning("No post office data extracted")
    else:
        logger.info(f"Extracted {len(rows)} post office entries")
    logger.info("Completed extraction of post offices data")
    return rows
