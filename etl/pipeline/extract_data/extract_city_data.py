import os
import json
import ijson
import logging
import time
from typing import Dict, Any
from etl.config.config import EXTRACTED_DIR
from etl.utils.file_operations import find_latest_json_file
from etl.utils.config_operations import get_city_paths

logger = logging.getLogger(__name__)

def extract_data_by_city(item: Dict[str, Any], city: str) -> bool:
    """Check if any post office in the item's addresses is in the specified city."""
    return any(
        post_office.get('city', '') == city
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

def extract_and_filter_city_data(city: str, project_dir: str, city_paths: dict) -> None:
    """Extract and filter data for a specific city."""
    start_time = time.time()
    try:
        paths = city_paths
        filtered_dir = paths['filtered_dir']

        os.makedirs(filtered_dir, exist_ok=True)

        latest_json_file = find_latest_json_file(EXTRACTED_DIR)
        if not latest_json_file:
            raise FileNotFoundError(f"No JSON file found in {EXTRACTED_DIR}")

        input_file_path = os.path.join(EXTRACTED_DIR, latest_json_file)
        output_file_path = os.path.join(filtered_dir, f"{city}_filtered.json")

        with open(input_file_path, 'r') as file, open(output_file_path, 'w') as output_file:
            parser = ijson.items(file, 'item')
            filtered_items = [item for item in parser if extract_data_by_city(item, city)]
            json.dump(filtered_items, output_file, indent=4)

        logger.info(f"Filtered data saved for city: {city}")
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        raise
    except Exception as e:
        logger.error(f"An error occurred while extracting and filtering data for city {city}. Error: {e}")
        raise
    finally:
        end_time = time.time()
        elapsed_time = end_time - start_time
        logger.info(f"Extracting and filtering data for city {city} took {elapsed_time:.2f} seconds")
