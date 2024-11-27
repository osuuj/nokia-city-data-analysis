import logging
from typing import List
from etl.utils.directory_operations import ensure_directory_exists
from etl.utils.config_operations import get_city_paths

logger = logging.getLogger(__name__)

def setup_directories(cities: List[str], processed_dir: str) -> None:
    """Set up necessary directories for each city."""
    logger.info("Setting up directories for all cities.")
    for city in cities:
        try:
            logger.info(f"Setting up directories for city: {city}")
            city_paths = get_city_paths(city, processed_dir)
            for path in city_paths.values():
                ensure_directory_exists(path)
            logger.info(f"Successfully set up directories for city: {city}")
        except Exception as e:
            logger.error(f"Error setting up directories for city {city}: {e}")
    logger.info("Completed setting up directories for all cities.")
