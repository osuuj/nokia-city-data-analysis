import os
import re
import sys
import logging
from typing import Dict, List
from dotenv import load_dotenv
from utils.logging_config import configure_logging
from config.config import project_dir

# Add the project directory to sys.path
sys.path.append(project_dir)

# Configure logging
configure_logging()

# Load environment variables from a .env file
load_dotenv()

# Import other necessary modules and functions
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
                logging.info(f"Deleted old file at {os.path.basename(file_path)}")
            download_file(url, file_path)
            
            if file_path.endswith('.zip'):
                extract_zip_file(file_path, EXTRACTED_DIR)
        else:
            logging.warning(f"Key '{key}' not found in FILE_PATHS")

def is_valid_file_path(base_dir: str, file_path: str) -> bool:
    """Check if the file path is within the base directory."""
    # Get the absolute paths
    base_dir = os.path.abspath(base_dir)
    file_path = os.path.abspath(file_path)
    
    # Check if the file path starts with the base directory path
    return os.path.commonpath([base_dir]) == os.path.commonpath([base_dir, file_path])

def process_city_data(cities: List[str]) -> None:
    """Extract, filter, split, and process city data."""
    for city in cities:
        filtered_dir = os.path.join(PROCESSED_DIR, city, 'filtered')
        ensure_directory_exists(filtered_dir)
        extract_and_filter_city_data(city, project_dir)
        
        split_city_data(city, project_dir)
        
        split_dir = get_city_paths(city)["split_dir"]
        for part in os.listdir(split_dir):
            part_path = os.path.join(split_dir, part)
            if os.path.isfile(part_path) and part_path.endswith('.json'):
                # Validate the file path
                if is_valid_file_path(split_dir, part_path):
                    # Extract the part number using a regular expression
                    match = re.search(r'part_(\d+)', part)
                    if match:
                        part_number = int(match.group(1))
                        process_json_file(part_path, part_number, city)
                    else:
                        logging.warning(f"Could not extract part number from filename: {part}")
                else:
                    logging.warning(f"Invalid file path detected: {part_path}")
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
