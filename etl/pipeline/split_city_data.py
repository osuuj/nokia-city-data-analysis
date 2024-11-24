import os
import json
import logging
from typing import Optional
from etl.config.config import get_city_paths

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def find_latest_json_file(directory: str) -> Optional[str]:
    """Find the latest JSON file in the specified directory."""
    if not os.path.exists(directory):
        logging.error(f"Directory {directory} does not exist")
        return None
    
    files = [f for f in os.listdir(directory) if f.endswith('.json')]
    if not files:
        logging.warning(f"No JSON files found in {directory}")
        return None
    
    latest_file = max(files, key=lambda f: os.path.getmtime(os.path.join(directory, f)))
    return latest_file

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

def split_city_data(city: str, project_dir: str) -> None:
    """Split the latest JSON file for the given city into smaller chunks."""
    try:
        city_paths = get_city_paths(city)
        filtered_dir = city_paths['filtered_dir']
        split_dir = city_paths['split_dir']

        # Ensure the split directory exists
        os.makedirs(split_dir, exist_ok=True)

        # Find the latest JSON file in the filtered directory
        latest_json_file = find_latest_json_file(filtered_dir)
        if not latest_json_file:
            logging.error(f"No JSON file found in {filtered_dir}")
            return

        # Define file paths
        input_file_path = os.path.join(filtered_dir, latest_json_file)
        output_dir = split_dir

        # Run the split
        split_json_file(input_file_path, output_dir, city, project_dir)
    except Exception as e:
        logging.error(f"An error occurred while splitting city data for {city}. Error: {e}")
