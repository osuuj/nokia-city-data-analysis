# scripts/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get file paths from environment variables
EXTRACTED_DIR = 'data/raw/extracted_data'
CITY_FILTERED_PATH = 'data/processed/nokia_companies.json'
SPLIT_DIR = 'data/processed/split_data'

# Define the URLs and file paths
URLS = {
    'all_companies': 'https://avoindata.prh.fi/opendata-ytj-api/v3/all_companies',
    'post_codes_en': 'https://avoindata.prh.fi/opendata-ytj-api/v3/post_codes?lang=en',
    'post_codes_fi': 'https://avoindata.prh.fi/opendata-ytj-api/v3/post_codes?lang=fi',
    'description_en': 'https://avoindata.prh.fi/opendata-ytj-api/v3/description?code=TOIMI3&lang=en',
    'description_fi': 'https://avoindata.prh.fi/opendata-ytj-api/v3/description?code=TOIMI3&lang=fi'
}

FILE_PATHS = {
    'all_companies': 'data/raw/all_companies.zip',
    'post_codes_en': 'data/raw/post_codes_en.json',
    'post_codes_fi': 'data/raw/post_codes_fi.json',
    'description_en': 'data/raw/description_en.json',
    'description_fi': 'data/raw/description_fi.json'
}

# PostgreSQL connection details
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}
