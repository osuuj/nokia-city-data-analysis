import os
import re
import json
import logging
import time
from etl.test.files.processors import (
    process_business_info, process_names_table, process_company_forms,
    process_registered_entries, process_addresses
)
from etl.utils.file_handling import save_to_csv, ensure_directory_exists
from etl.utils.helpers import clean_addresses_table, is_valid_file_path
from etl.config.logging_config import setup_logging
from etl.config.config import get_city_paths

logger = setup_logging()

def process_city_parts(city: str, split_dir: str) -> None:
    """Process each city part after splitting the data."""
    for part in os.listdir(split_dir):
        part_path = os.path.join(split_dir, part)
        if os.path.isfile(part_path) and part_path.endswith('.json'):
            if is_valid_file_path(split_dir, part_path):
                match = re.search(r'part_(\d+)', part)
                if match:
                    part_number = int(match.group(1))
                    process_json_file(part_path, part_number, city)
                else:
                    logger.warning(f"Could not extract part number from filename: {part}")
            else:
                logger.warning(f"Invalid file path detected: {part_path}")

def process_json_file(file_path: str, part_number: int, city: str) -> None:
    """Process a single JSON file."""
    start_time = time.time()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Tables for export
        business_info = []
        names_table = []
        company_forms_table = []
        registered_entries_table = []
        addresses_table = []
        business_name_history = []

        # Process each company
        for company in data:
            process_business_info(company, business_info)
            process_names_table(company, names_table, business_name_history)
            process_company_forms(company, company_forms_table)
            process_registered_entries(company, registered_entries_table)
            process_addresses(company, addresses_table)

        # Clean addresses table
        cleaned_addresses = clean_addresses_table(addresses_table)

        # Get the cleaned directory path for the city
        city_paths = get_city_paths(city)
        cleaned_dir = city_paths['cleaned_dir']
        
        # Ensure the cleaned directory exists
        ensure_directory_exists(cleaned_dir)

        # Save tables to CSV
        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_business_info.csv', business_info, [
            "business_id", "registration_date", "eu_id", "primary_name", 
            "main_business_line", "status", 
            "end_date", "last_modified",  "website"
        ])

        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_names.csv', names_table, [
            "business_id", "name", "type", "registration_date", "start_date", "end_date", "name_version"
        ])

        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_company_forms.csv', company_forms_table, [
            "business_id", "description", "registration_date", "end_date"
        ])

        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_registered_entries.csv', registered_entries_table, [
            "business_id", "description", "registration_date", "register", "authority"
        ])

        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_addresses.csv', cleaned_addresses, [
            "business_id", "address_type", "address", "building_number", "entrance", "apartment_number", "post_code", "city", "municipality_code", "co", "country"
        ])

        save_to_csv(f'{cleaned_dir}/cleaned_{city}_part_{part_number}_business_name_history.csv', business_name_history, [
            "business_id", "previous_name", "new_name", "change_date"
        ])
    except Exception as e:
        logging.error(f"An error occurred while processing the JSON file {os.path.basename(file_path)}. Error: {e}")
    finally:
        end_time = time.time()
        duration = end_time - start_time
        logging.info(f"Processing {os.path.basename(file_path)} took {duration:.2f} seconds")
