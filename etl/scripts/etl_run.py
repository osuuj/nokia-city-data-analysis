import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Add the project directory to sys.path
project_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(project_dir)

# Import constants from config
from etl.config.config import URLS, FILE_PATHS, EXTRACTED_DIR, PROCESSED_DIR, get_city_paths, get_supported_cities

config_file_path = os.path.join(project_dir, 'etl', 'config', 'urls.yml')
cities_file_path = os.path.join(project_dir, 'etl', 'config', 'cities.yml')
if not os.path.exists(config_file_path):
    logging.error(f"Configuration file not found: {config_file_path}")
    sys.exit(1)
if not os.path.exists(cities_file_path):
    logging.error(f"Configuration file not found: {cities_file_path}")
    sys.exit(1)

try:
    from etl.config.config import URLS, FILE_PATHS, EXTRACTED_DIR, PROCESSED_DIR, get_city_paths, get_supported_cities
    # Removed the problematic import
    # from etl.pipeline.utils import find_latest_json_file
except (FileNotFoundError, ImportError) as e:
    logging.error(f"Configuration or utility file not found: {e}")
    sys.exit(1)

from etl.pipeline.download_data import download_file, extract_zip_file
from etl.pipeline.extract_city_data import extract_and_filter_city_data
from etl.pipeline.split_city_data import split_city_data
from etl.pipeline.cleaning_data import process_json_file  # Correct import

# Ensure raw directory exists
raw_dir = os.path.join(project_dir, 'etl', 'data', 'raw')
os.makedirs(raw_dir, exist_ok=True)

# Ensure logs directory exists within the etl folder
log_dir = os.path.join(project_dir, 'etl', 'logs')
os.makedirs(log_dir, exist_ok=True)

def main():
    # Ensure directory structure for each city
    cities = get_supported_cities()
    for city in cities:
        city_paths = get_city_paths(city)
        for path in city_paths.values():
            os.makedirs(path, exist_ok=True)
    
    # Download all files
    for key, url in URLS.items():
        if key in FILE_PATHS:
            file_path = os.path.join(project_dir, 'etl', FILE_PATHS[key])
            if os.path.exists(file_path):
                os.remove(file_path)
                logging.info(f"Deleted old file at {file_path}")
            download_file(url, file_path)
            
            # Extract if the file is a zip file
            if file_path.endswith('.zip'):
                extract_zip_file(file_path, EXTRACTED_DIR)
        else:
            logging.warning(f"Key '{key}' not found in FILE_PATHS")
    
    # Extract and filter city data
    for city in cities:
        filtered_dir = os.path.join(PROCESSED_DIR, city, 'filtered')
        os.makedirs(filtered_dir, exist_ok=True)
        extract_and_filter_city_data(city)
        
        # Split city data
        split_city_data(city)
        
        # Process JSON files
        split_dir = get_city_paths(city)["split_dir"]
        for part in os.listdir(split_dir):
            part_path = os.path.join(split_dir, part)
            if os.path.isfile(part_path) and part_path.endswith('.json'):
                process_json_file(part_path, part.split('.')[0])

if __name__ == "__main__":
    main()
