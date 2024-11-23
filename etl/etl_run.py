# etl/etl_run.py
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

# Import constants and functions from config
from etl.config.config import URLS, FILE_PATHS, EXTRACTED_DIR, PROCESSED_DIR, get_city_paths, get_supported_cities
from etl.pipeline.download_data import download_file, extract_zip_file
from etl.pipeline.extract_city_data import extract_and_filter_city_data
from etl.pipeline.split_city_data import split_city_data
from etl.pipeline.cleaning_data import process_json_file

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    os.makedirs(path, exist_ok=True)

def setup_directories(cities: List[str]) -> None:
    """Set up necessary directories for each city."""
    for city in cities:
        city_paths = get_city_paths(city)
        for path in city_paths.values():
            ensure_directory_exists(path)

def download_and_extract_files(urls: Dict[str, str], file_paths: Dict[str, str]) -> None:
    """Download and extract files based on provided URLs and file paths."""
    for key, url in urls.items():
        if key in file_paths:
            file_path = os.path.join(project_dir, 'etl', file_paths[key])
            if os.path.exists(file_path):
                os.remove(file_path)
                logging.info(f"Deleted old file at {file_path}")
            download_file(url, file_path)
            
            if file_path.endswith('.zip'):
                extract_zip_file(file_path, EXTRACTED_DIR)
        else:
            logging.warning(f"Key '{key}' not found in FILE_PATHS")

def process_city_data(cities: List[str]) -> None:
    """Extract, filter, split, and process city data."""
    for city in cities:
        filtered_dir = os.path.join(PROCESSED_DIR, city, 'filtered')
        ensure_directory_exists(filtered_dir)
        extract_and_filter_city_data(city)
        
        split_city_data(city)
        
        split_dir = get_city_paths(city)["split_dir"]
        for part in os.listdir(split_dir):
            part_path = os.path.join(split_dir, part)
            if os.path.isfile(part_path) and part_path.endswith('.json'):
                process_json_file(part_path, part.split('.')[0])

def main() -> None:
    """Main function to run the ETL process."""
    cities = get_supported_cities()
    setup_directories(cities)
    download_and_extract_files(URLS, FILE_PATHS)
    process_city_data(cities)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logging.error(f"An error occurred: {e}")
