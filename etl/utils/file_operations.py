import os
import csv
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

def find_latest_json_file(directory: str) -> Optional[str]:
    """Find the latest JSON file in the specified directory."""
    try:
        if not os.path.exists(directory):
            logger.error("Directory does not exist")
            return None
        
        json_files = [f for f in os.listdir(directory) if f.endswith('.json')]
        if not json_files:
            logger.warning("No JSON files found")
            return None
        
        latest_file = max(json_files, key=lambda f: os.path.getmtime(os.path.join(directory, f)))
        return latest_file
    except Exception as e:
        logger.error(f"Error finding latest JSON file: {e}")
        return None

def is_valid_file_path(base_dir: str, file_path: str) -> bool:
    """Check if the file path is within the base directory."""
    try:
        base_dir = os.path.abspath(base_dir)
        file_path = os.path.abspath(file_path)
        is_valid = os.path.commonpath([base_dir]) == os.path.commonpath([base_dir, file_path])
        return is_valid
    except Exception as e:
        logger.error(f"Error validating file path: {e}")
        return False

def save_to_csv(filename: str, data: List[Dict[str, Any]], headers: List[str]) -> None:
    """Save tables to CSV."""
    try:
        if not is_valid_file_path(os.getcwd(), filename):
            raise ValueError("Invalid file path")
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)
    except ValueError as ve:
        logger.error(f"Value error: {ve}")
    except Exception as e:
        logger.error(f"Failed to save data: {e}")
