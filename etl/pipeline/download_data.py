import os
import requests
import zipfile
import logging
import yaml
from typing import Dict

def read_urls_from_config(config_path: str) -> Dict[str, str]:
    """Read URLs from a YAML configuration file."""
    try:
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
        logging.info(f"Read URLs from config file: {os.path.basename(config_path)}")
        return config['urls']
    except Exception as e:
        logging.error(f"Failed to read URLs from config file {os.path.basename(config_path)}. Error: {e}")
        return {}

def download_file(url: str, file_path: str) -> None:
    """Download a file from a URL to a specified path."""
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Deleted old file at {os.path.basename(file_path)}")
        
        # Send a GET request to the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes
        
        # Write the content to a file in chunks
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        logging.info(f"Downloaded file to {os.path.basename(file_path)}")
    except requests.RequestException as e:
        logging.error(f"Failed to download file from {url}. Error: {e}")

def clear_directory(directory: str) -> None:
    """Clear all files and directories in the specified directory."""
    if os.path.exists(directory):
        for root, dirs, files in os.walk(directory, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        logging.info(f"Cleared old extracted files in {os.path.basename(directory)}")

def extract_zip_file(zip_file_path: str, extracted_dir: str) -> None:
    """Extract a ZIP file to a specified directory."""
    try:
        clear_directory(extracted_dir)
        
        # Extract the ZIP file
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_dir)
        logging.info(f"Extracted ZIP file to {os.path.basename(extracted_dir)}")
    except zipfile.BadZipFile as e:
        logging.error(f"Failed to extract ZIP file {os.path.basename(zip_file_path)}. Error: {e}")
