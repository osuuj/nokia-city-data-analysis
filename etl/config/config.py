import os
import sys
try:
    from dotenv import load_dotenv
    load_dotenv()
except ModuleNotFoundError:
    print("Warning: 'dotenv' module not found. Environment variables might not be loaded.")

import yaml

# Helper to load YAML configuration files
def load_yaml(file_path: str) -> dict:
    try:
        with open(file_path, 'r') as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {file_path}")

project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
urls_path = os.path.join(project_dir, 'etl', 'config', 'urls.yml')
cities_path = os.path.join(project_dir, 'etl', 'config', 'cities.yml')

try:
    URLS = load_yaml(urls_path)['urls']
    CITIES = load_yaml(cities_path)
except FileNotFoundError as e:
    print(f"Error: {e}")
    sys.exit(1)

# New constant to map keys to file paths
FILE_PATHS = {
    'all_companies': 'data/raw/all_companies.zip',
    'post_codes_en': 'data/raw/post_codes_en.json',
    'post_codes_fi': 'data/raw/post_codes_fi.json',
    'description_en': 'data/raw/description_en.json',
    'description_fi': 'data/raw/description_fi.json',
}

# PostgreSQL connection details
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
}

# Directory paths
EXTRACTED_DIR = os.getenv('EXTRACTED_DIR', os.path.join(project_dir, 'etl', 'data', 'extracted'))
PROCESSED_DIR = os.getenv('PROCESSED_DIR', os.path.join(project_dir, 'etl', 'data', 'processed'))
SPLIT_DIR = os.getenv('SPLIT_DIR', os.path.join(project_dir, 'etl', 'data', 'splitted'))
CLEANED_DIR = os.getenv('CLEANED_DIR', os.path.join(project_dir, 'etl', 'data', 'cleaned'))  # Ensure CLEANED_DIR is defined
CITY = os.getenv('CITY', 'default_city')  # Ensure CITY is defined

# Generate paths for a given city dynamically
def get_city_paths(city: str) -> dict:
    return {
        "city_dir": os.path.join(PROCESSED_DIR, city),
        "filtered_dir": os.path.join(PROCESSED_DIR, city, 'filtered'),
        "split_dir": os.path.join(PROCESSED_DIR, city, 'splitted'),
    }

# Fetch all supported cities
def get_supported_cities():
    return [city['name'] for city in CITIES['cities']]
