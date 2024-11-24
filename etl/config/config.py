import os
import sys
import logging
from typing import Dict, List
from dotenv import load_dotenv
import yaml

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Define project directory
project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Define configuration file paths
urls_path = os.path.join(project_dir, 'etl', 'config', 'urls.yml')
cities_path = os.path.join(project_dir, 'etl', 'config', 'cities.yml')

# Load URLs and cities from configuration files
def load_yaml(file_path: str) -> dict:
    """Load a YAML configuration file."""
    try:
        with open(file_path, 'r') as file:
            return yaml.safe_load(file)
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {file_path}")

try:
    URLS = load_yaml(urls_path)['urls']
    CITIES = load_yaml(cities_path)['cities']
except FileNotFoundError as e:
    logging.error(f"Error: {e}")
    sys.exit(1)

# Define directory paths
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
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 5432)),
}

def get_city_paths(city: str) -> Dict[str, str]:
    """Generate paths for a given city dynamically."""
    return {
        "city_dir": os.path.join(PROCESSED_DIR, city),
        "filtered_dir": os.path.join(PROCESSED_DIR, city, 'filtered'),
        "split_dir": os.path.join(PROCESSED_DIR, city, 'splitted'),
        "cleaned_dir": os.path.join(PROCESSED_DIR, city, 'cleaned')
    }

def get_supported_cities() -> List[str]:
    """Fetch all supported cities."""
    return [city['name'] for city in CITIES]
