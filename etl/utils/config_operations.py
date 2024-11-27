import os
import yaml
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

def load_yaml(file_path: str) -> dict:
    """Load a YAML configuration file."""
    try:
        with open(file_path, 'r') as file:
            data = yaml.safe_load(file)
            logger.info(f"Successfully loaded YAML file: {os.path.basename(file_path)}")
            return data
    except FileNotFoundError:
        logger.error(f"Configuration file not found: {os.path.basename(file_path)}")
        raise FileNotFoundError(f"Configuration file not found: {os.path.basename(file_path)}")
    except yaml.YAMLError as e:
        logger.error(f"Error parsing YAML file {os.path.basename(file_path)}: {e}")
        raise ValueError(f"Error parsing YAML file {os.path.basename(file_path)}: {e}")

def load_config(file_path: str, key: str) -> Any:
    """Load configuration from a YAML file."""
    try:
        config = load_yaml(file_path).get(key)
        if config is None:
            raise ValueError(f"Key '{key}' not found in the configuration file.")
        if key == 'cities' and not all(isinstance(city, str) for city in config):
            raise ValueError("CITIES should be a list of strings")
        logger.info(f"Successfully loaded config for key: {key}")
        return config
    except (FileNotFoundError, ValueError) as e:
        logger.error(f"Error loading config: {e}")
        raise

def get_city_paths(city: str, processed_dir: str) -> Dict[str, str]:
    """Generate paths for a given city dynamically."""
    city_paths = {
        "city_dir": os.path.join(processed_dir, city),
        "filtered_dir": os.path.join(processed_dir, city, 'filtered'),
        "split_dir": os.path.join(processed_dir, city, 'splitted'),
        "cleaned_dir": os.path.join(processed_dir, city, 'cleaned')
    }
    logger.info(f"Generated paths for city: {city}")
    return city_paths

def get_supported_cities(cities: List[Dict[str, Any]]) -> List[str]:
    """Fetch all supported cities."""
    supported_cities = [city['name'] for city in cities]
    logger.info(f"Supported cities: {supported_cities}")
    return supported_cities
