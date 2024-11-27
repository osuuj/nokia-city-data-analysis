import os
import csv
import logging
from typing import List, Dict, Any, Optional

def find_latest_json_file(directory: str) -> Optional[str]:
    """Find the latest JSON file in the specified directory."""
    if not os.path.exists(directory):
        logging.error(f"Directory {directory} does not exist")
        return None
    
    json_files = [f for f in os.listdir(directory) if f.endswith('.json')]
    if not json_files:
        logging.warning(f"No JSON files found in {directory}")
        return None
    
    latest_file = max(json_files, key=lambda f: os.path.getmtime(os.path.join(directory, f)))
    return latest_file

def is_valid_file_path(base_dir: str, file_path: str) -> bool:
    """Check if the file path is within the base directory."""
    base_dir = os.path.abspath(base_dir)
    file_path = os.path.abspath(file_path)
    return os.path.commonpath([base_dir]) == os.path.commonpath([base_dir, file_path])

def save_to_csv(filename: str, data: List[Dict[str, Any]], headers: List[str]) -> None:
    """Save tables to CSV."""
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)
        logging.info(f"Data saved to {os.path.basename(filename)}")
    except Exception as e:
        logging.error(f"Failed to save data to {os.path.basename(filename)}. Error: {e}")
