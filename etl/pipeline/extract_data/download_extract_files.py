import os
import requests
import zipfile
import logging
import ijson
from etl.utils.directory_operations import clear_directory, ensure_directory_exists

logger = logging.getLogger(__name__)

def download_file(url: str, destination_path: str) -> None:
    """
    Download a file from a URL and save it to the specified path.
    
    Args:
        url (str): The URL to download the file from.
        destination_path (str): The full path where the file will be saved.
    """
    try:
        # Ensure the directory for the destination path exists
        ensure_directory_exists(os.path.dirname(destination_path))
        
        # Remove old file if it exists
        if os.path.exists(destination_path) and os.path.isfile(destination_path):
            os.remove(destination_path)
            logger.info(f"Deleted old file at {destination_path}")

        # Send a GET request to the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes

        # Write the content to a file in chunks
        with open(destination_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        logger.info(f"Downloaded file to {destination_path}")
    except requests.RequestException as e:
        logger.error(f"Failed to download file from {url}. Error: {e}")
        raise

def extract_zip_file(zip_file_path: str, extracted_dir: str) -> None:
    """
    Extract a ZIP file to the specified directory.

    Args:
        zip_file_path (str): The path to the ZIP file.
        extracted_dir (str): The directory where the contents will be extracted.
    """
    try:
        # Ensure the extracted directory exists
        logger.info(f"Ensuring directory exists: {extracted_dir}")
        ensure_directory_exists(extracted_dir)
        
        # Clear the extracted directory
        logger.info(f"Clearing directory: {extracted_dir}")
        clear_directory(extracted_dir)

        # Extract the ZIP file
        logger.info(f"Extracting ZIP file: {zip_file_path} to {extracted_dir}")
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_dir)
        logger.info(f"Extracted ZIP file to {extracted_dir}")
    except zipfile.BadZipFile as e:
        logger.error(f"Failed to extract ZIP file {zip_file_path}. Error: {e}")
        raise
    except Exception as e:
        logger.error(f"An unexpected error occurred while extracting ZIP file {zip_file_path}. Error: {e}")
        raise

def download_and_extract_files(url: str, raw_file_path: str, extracted_dir: str) -> None:
    """
    Download a file from a URL, save it to a specified path, and extract it if it is a ZIP file.

    Args:
        url (str): The URL to download the file from.
        raw_file_path (str): The full path to save the downloaded file.
        extracted_dir (str): The directory where the contents of the ZIP file will be extracted.
    """
    try:
        logger.info(f"Starting processing for URL '{url}'")
        
        # Step 1: Download the file to the specified path
        logger.info(f"Downloading file to {raw_file_path}")
        download_file(url, raw_file_path)

        # Step 2: Extract if the file is a ZIP archive
        if raw_file_path.endswith('.zip'):
            logger.info(f"File is a ZIP archive. Extracting to {extracted_dir}")
            extract_zip_file(raw_file_path, extracted_dir)
        else:
            logger.warning(f"The downloaded file is not a ZIP archive: {raw_file_path}")
    except Exception as e:
        logger.error(f"Error processing URL '{url}': {e}")
        raise

def stream_json(file_path):
    """Streams JSON file in a memory-efficient manner."""
    with open(file_path, 'r', encoding='utf-8') as file:
        for record in ijson.items(file, 'item'):
            yield record
