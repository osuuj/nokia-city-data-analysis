import os
import csv
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

def find_latest_json_file(directory: str) -> Optional[str]:
    """Find the latest JSON file in the specified directory."""
    try:
        if not os.path.exists(directory):
            logger.error(f"Directory {os.path.basename(directory)} does not exist")
            return None
        
        json_files = [f for f in os.listdir(directory) if f.endswith('.json')]
        if not json_files:
            logger.warning(f"No JSON files found in {os.path.basename(directory)}")
            return None
        
        latest_file = max(json_files, key=lambda f: os.path.getmtime(os.path.join(directory, f)))
        logger.info(f"Latest JSON file found: {latest_file}")
        return latest_file
    except Exception as e:
        logger.error(f"Error finding latest JSON file in {os.path.basename(directory)}: {e}")
        return None

def is_valid_file_path(base_dir: str, file_path: str) -> bool:
    """Check if the file path is within the base directory."""
    try:
        base_dir = os.path.abspath(base_dir)
        file_path = os.path.abspath(file_path)
        is_valid = os.path.commonpath([base_dir]) == os.path.commonpath([base_dir, file_path])
        logger.info(f"File path validation for {os.path.basename(file_path)} within {os.path.basename(base_dir)}: {is_valid}")
        return is_valid
    except Exception as e:
        logger.error(f"Error validating file path {os.path.basename(file_path)} within {os.path.basename(base_dir)}: {e}")
        return False

def save_to_csv(filename: str, data: List[Dict[str, Any]], headers: List[str]) -> None:
    """Save tables to CSV."""
    try:
        if not is_valid_file_path(os.getcwd(), filename):
            raise ValueError(f"Invalid file path: {os.path.basename(filename)}")
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)
    except ValueError as ve:
        logger.error(f"Value error: {ve}")
    except Exception as e:
        logger.error(f"Failed to save data to {os.path.basename(filename)}. Error: {e}")
