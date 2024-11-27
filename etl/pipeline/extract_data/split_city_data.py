import os
import json
import logging
from etl.utils.file_operations import find_latest_json_file

def split_json_file(input_file_path: str, output_dir: str, city: str, project_dir: str, chunk_size: int = 1000) -> None:
    """Split data into smaller chunks and save to output directory."""
    try:
        with open(input_file_path, 'r') as file:
            data = json.load(file)
        
        os.makedirs(output_dir, exist_ok=True)
        
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i + chunk_size]
            chunk_file_name = f"splitted_{city}_part_{i//chunk_size}.json"
            chunk_file_path = os.path.join(output_dir, chunk_file_name)
            with open(chunk_file_path, 'w') as chunk_file:
                json.dump(chunk, chunk_file)
        
        logging.info(f"Data split into chunks and saved to {os.path.relpath(output_dir, project_dir)}")
    except Exception as e:
        logging.error(f"An error occurred while splitting the JSON file. Error: {e}")

def split_city_data(city: str, project_dir: str, city_paths: dict) -> None:
    """Split the latest JSON file for the given city into smaller chunks."""
    try:
        filtered_dir = city_paths['filtered_dir']
        split_dir = city_paths['split_dir']

        os.makedirs(split_dir, exist_ok=True)

        latest_json_file = find_latest_json_file(filtered_dir)
        if not latest_json_file:
            logging.error(f"No JSON file found in {filtered_dir}")
            return

        input_file_path = os.path.join(filtered_dir, latest_json_file)
        split_json_file(input_file_path, split_dir, city, project_dir)
    except Exception as e:
        logging.error(f"An error occurred while splitting city data for {city}. Error: {e}")
