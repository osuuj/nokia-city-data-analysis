import os
import requests
import zipfile
import logging
from typing import Dict
from etl.config.config import EXTRACTED_DIR
from etl.utils.directory_operations import clear_directory

logger = logging.getLogger(__name__)

def download_file(url: str, file_path: str) -> None:
    """Download a file from a URL to a specified path."""
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Deleted old file at {os.path.basename(file_path)}")
        
        # Send a GET request to the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes
        
        # Write the content to a file in chunks
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        logger.info(f"Downloaded file to {os.path.basename(file_path)}")
    except requests.RequestException as e:
        logger.error(f"Failed to download file from {url}. Error: {e}")
        raise

def extract_zip_file(zip_file_path: str, extracted_dir: str) -> None:
    """Extract a ZIP file to a specified directory."""
    try:
        clear_directory(extracted_dir)
        # Extract the ZIP file
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_dir)
        logger.info(f"Extracted ZIP file to {os.path.basename(extracted_dir)}")
    except zipfile.BadZipFile as e:
        logger.error(f"Failed to extract ZIP file {os.path.basename(zip_file_path)}. Error: {e}")
        raise

def download_and_extract_files(urls: Dict[str, str], file_paths: Dict[str, str], project_dir: str) -> None:
    """Download and extract files based on provided URLs and file paths."""
    for key, url in urls.items():
        if key in file_paths:
            file_path = os.path.join(project_dir, 'etl', file_paths[key])
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted old file at {os.path.basename(file_path)}")
            download_file(url, file_path)
            
            if file_path.endswith('.zip'):
                extract_zip_file(file_path, EXTRACTED_DIR)
        else:
            logger.warning(f"Key '{key}' not found in FILE_PATHS")
