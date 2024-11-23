import os
import requests
import zipfile
import logging
import yaml  # Import yaml to read the configuration file
from etl.config.logging_config import log_file_path  # Import the logging configuration
from etl.config.config import FILE_PATHS  # Import constants from config

# Configure logging
log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'etl', 'logs')
os.makedirs(log_dir, exist_ok=True)
log_file_path = os.path.join(log_dir, 'etl.log')
logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def read_urls_from_config(config_path):
    """Read URLs from a YAML configuration file."""
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config['urls']

def download_file(url, file_path):
    """Download a file from a URL to a specified path."""
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            logging.info(f"Deleted old file at {file_path}")
        
        # Send a GET request to the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes
        
        # Write the content to a file in chunks
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        logging.info(f"Downloaded file to {file_path}")
    except requests.RequestException as e:
        logging.error(f"Failed to download file from {url}. Error: {e}")

def clear_directory(directory):
    """Clear all files and directories in the specified directory."""
    if os.path.exists(directory):
        for root, dirs, files in os.walk(directory, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        logging.info(f"Cleared old extracted files in {directory}")

def extract_zip_file(zip_file_path, extracted_dir):
    """Extract a ZIP file to a specified directory."""
    try:
        clear_directory(extracted_dir)
        
        # Extract the ZIP file
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_dir)
        logging.info(f"Extracted ZIP file to {extracted_dir}")
    except zipfile.BadZipFile as e:
        logging.error(f"Failed to extract ZIP file {zip_file_path}. Error: {e}")
