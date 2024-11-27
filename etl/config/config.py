import os
import sys
from etl.utils.config_operations import load_config

# Define paths to configuration files
urls_path = os.path.join(os.path.dirname(__file__), 'urls.yml')
cities_path = os.path.join(os.path.dirname(__file__), 'cities.yml')

# Load URLs and cities from configuration files
try:
    URLS = load_config(urls_path, 'urls')
    CITIES = load_config(cities_path, 'cities')
except SystemExit:
    sys.exit(1)

# Define directory paths
project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXTRACTED_DIR = os.getenv('EXTRACTED_DIR', os.path.join(project_dir, 'etl', 'data', 'extracted'))
PROCESSED_DIR = os.getenv('PROCESSED_DIR', os.path.join(project_dir, 'etl', 'data', 'processed'))

# Define file paths for different data sources
FILE_PATHS = {
    'all_companies': 'data/raw/all_companies.zip',
    'post_codes_en': 'data/raw/post_codes_en.json',
    'post_codes_fi': 'data/raw/post_codes_fi.json',
    'description_en': 'data/raw/description_en.json',
    'description_fi': 'data/raw/description_fi.json',
}

# PostgreSQL connection details
DB_CONFIG = {
    'dbname': os.getenv('POSTGRES_DB'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
}

CSV_COLUMNS = {
    "business_info_table": [
        "business_id", "registration_date", "eu_id", "primary_name", 
        "main_business_line", "status", "end_date", "last_modified", "website"
    ],
    "names_table": [
        "business_id", "name", "type", "registration_date", "start_date", "end_date", "name_version"
    ],
    "company_forms_table": [
        "business_id", "description", "registration_date", "end_date"
    ],
    "registered_entries_table": [
        "business_id", "description", "registration_date", "register", "authority"
    ],
    "addresses_table": [
        "business_id", "address_type", "address", "building_number", 
        "entrance", "apartment_number", "post_code", "city", 
        "municipality_code", "co", "country"
    ],
    "business_name_history_table": [
        "business_id", "previous_name", "new_name", "change_date"
    ]
}
