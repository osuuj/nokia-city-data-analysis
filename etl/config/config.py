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
except (FileNotFoundError, ValueError) as e:
    sys.exit(f"Error loading configuration: {e}")

# Define directory paths
project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EXTRACTED_DIR = os.getenv('EXTRACTED_DIR', os.path.join(project_dir, 'etl', 'data', '2_extracted'))
PROCESSED_DIR = os.getenv('PROCESSED_DIR', os.path.join(project_dir, 'etl', 'data', '3_processed'))

# Define file paths for different data sources
FILE_PATHS = {
    'all_companies': 'data/1_raw/all_companies.zip',
    'post_codes_en': 'data/1_raw/post_codes_en.json',
    'post_codes_fi': 'data/1_raw/post_codes_fi.json',
    'description_en': 'data/1_raw/description_en.json',
    'description_fi': 'data/1_raw/description_fi.json',
}

# PostgreSQL connection details
DB_CONFIG = {
    'dbname': os.getenv('POSTGRES_DB'),
    'user': os.getenv('POSTGRES_USER'),
    'password': os.getenv('POSTGRES_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
}
