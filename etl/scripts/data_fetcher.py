import logging
import os
import tarfile
import time
import zipfile
from typing import Generator

import ijson
import requests

from etl.utils.file_system_utils import clear_directory, ensure_directory_exists

logger = logging.getLogger(__name__)


def ensure_safe_extraction(destination_dir: str, member_name: str) -> bool:
    """Ensure the extracted file doesn't lead outside the destination directory.

    Args:
        destination_dir (str): The directory where files are being extracted.
        member_name (str): The name of the file to be extracted.

    Returns:
        bool: True if the file is safe to extract; False otherwise.
    """
    extracted_path = os.path.abspath(os.path.join(destination_dir, member_name))
    return extracted_path.startswith(os.path.abspath(destination_dir))


def download_file(
    url: str,
    destination_path: str,
    chunk_size: int,
    retries: int = 3,
    delay: int = 5,
) -> None:
    """Download a file with retry logic.

    Args:
        url (str): URL of the file to download.
        destination_path (str): Path to save the downloaded file.
        chunk_size (int): Size of chunks for streaming the download.
        retries (int): Number of retry attempts in case of failure.
        delay (int): Delay in seconds between retry attempts.

    Raises:
        requests.RequestException: If all retry attempts fail.
    """
    for attempt in range(retries):
        try:
            ensure_directory_exists(os.path.dirname(destination_path))

            if os.path.exists(destination_path):
                os.remove(destination_path)
                logger.info(f"Deleted old file at {destination_path}")

            logger.info(
                f"Attempting to download file from {url} (Attempt {attempt + 1}/{retries})"
            )
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()

            with open(destination_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    file.write(chunk)

            logger.info(f"Downloaded file to {destination_path}")
            return
        except requests.RequestException as e:
            logger.warning(f"Download attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                logger.error(f"Failed to download file after {retries} attempts.")
                raise
        except OSError as e:
            logger.error(f"Error saving file {destination_path}: {e}")
            raise


def extract_file(file_path: str, extracted_dir: str) -> None:
    """Extract a file (ZIP or TAR) to the specified directory.

    Args:
        file_path (str): Path to the file to extract.
        extracted_dir (str): Directory where files will be extracted.

    Raises:
        RuntimeError: If the file cannot be extracted or is unsupported.
    """
    ensure_directory_exists(extracted_dir)
    clear_directory(extracted_dir)

    try:
        if file_path.endswith(".zip"):
            with zipfile.ZipFile(file_path, "r") as zip_ref:
                for member in zip_ref.namelist():
                    if ensure_safe_extraction(extracted_dir, member):
                        zip_ref.extract(member, extracted_dir)
                    else:
                        logger.error(
                            f"Unsafe file detected: {member}. Skipping extraction."
                        )
                logger.info(f"Extracted ZIP file to {extracted_dir}")
        elif file_path.endswith(".tar.gz") or file_path.endswith(".tgz"):
            with tarfile.open(file_path, "r:gz") as tar_ref:
                for member in tar_ref.getmembers():
                    if ensure_safe_extraction(extracted_dir, member.name):
                        tar_ref.extract(member, extracted_dir)
                    else:
                        logger.error(
                            f"Unsafe file detected: {member.name}. Skipping extraction."
                        )
                logger.info(f"Extracted TAR file to {extracted_dir}")
        else:
            logger.warning(f"Unsupported file format: {file_path}")
            raise RuntimeError(f"Unsupported file format: {file_path}")
    except RuntimeError as e:
        logger.error(f"Error extracting file {file_path}: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error extracting file {file_path}: {e}")
        raise RuntimeError(f"Unexpected error extracting file {file_path}: {e}")


def download_and_extract_files(
    url: str, raw_file_path: str, extracted_dir: str, chunk_size: int
) -> None:
    """Download a file and extract it if it is a supported format.

    Args:
        url (str): URL of the file to download.
        raw_file_path (str): Path to save the downloaded file.
        extracted_dir (str): Directory where files will be extracted.
        chunk_size (int): Size of chunks for streaming the download.

    Raises:
        RuntimeError: If downloading or extraction fails.
    """
    try:
        download_file(url, raw_file_path, chunk_size)
        extract_file(raw_file_path, extracted_dir)
    except RuntimeError as e:
        logger.error(f"Error during download and extraction: {e}")
        raise


def stream_json(file_path: str) -> Generator[dict, None, None]:
    """Stream JSON file in a memory-efficient manner.

    Args:
        file_path (str): Path to the JSON file.

    Yields:
        dict: Parsed JSON records.

    Raises:
        Exception: If there is an error reading or parsing the JSON file.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            for record in ijson.items(file, "item"):
                yield record
    except Exception as e:
        logger.error(f"Error streaming JSON file {file_path}: {e}")
        raise
