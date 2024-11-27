from typing import List
from etl.utils.directory_operations import ensure_directory_exists
from etl.utils.config_operations import get_city_paths

def setup_directories(cities: List[str], processed_dir: str) -> None:
    """Set up necessary directories for each city."""
    for city in cities:
        city_paths = get_city_paths(city, processed_dir)
        for path in city_paths.values():
            ensure_directory_exists(path)
