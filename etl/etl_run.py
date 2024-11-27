import logging
from typing import List
from etl.config.logging_config import configure_logging
from etl.pipeline.extract_data.download_extract_files import download_and_extract_files
from etl.pipeline.extract_data.extract_city_data import extract_and_filter_city_data
from etl.pipeline.extract_data.split_city_data import split_city_data
from etl.pipeline.cleaning_data.process_data import process_data
from etl.config.config import URLS, FILE_PATHS, CITIES, project_dir, PROCESSED_DIR
from etl.utils.config_operations import get_city_paths
from etl.utils.directory_setup import setup_directories

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

def process_city_data(cities: List[str]) -> None:
    """Orchestrate the processing of city data."""
    for city in cities:
        city_paths = get_city_paths(city, PROCESSED_DIR)
        extract_and_filter_city_data(city, project_dir, city_paths)
        split_city_data(city, project_dir, city_paths)
        # Process data
        process_data(city, project_dir, city_paths)
    
def main() -> None:
    """Main function to run the ETL process."""
    #setup_directories(CITIES, PROCESSED_DIR)
    #download_and_extract_files(URLS, FILE_PATHS, project_dir)
    process_city_data(CITIES)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        logging.error(f"An error occurred: {e}")
