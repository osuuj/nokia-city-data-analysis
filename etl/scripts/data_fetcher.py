"""
Utilities for downloading and extracting data files.

This module provides functions to download files from specified URLs
with retry logic and to extract files in supported formats (ZIP, TAR).
It also includes functionality to stream JSON files for memory-efficient
processing.
"""

import logging
import os
import tarfile
import time
import zipfile

import ijson
import requests

from etl.utils.file_system_utils import clear_directory, ensure_directory_exists

logger = logging.getLogger(__name__)


def download_file(
    url: str, destination_path: str, chunk_size: int, retries: int = 3, delay: int = 5
) -> None:
    """
    Download a file with retry logic.

    :param url: URL of the file to download.
    :param destination_path: Path to save the downloaded file.
    :param chunk_size: Size of chunks for streaming the download.
    :param retries: Number of retry attempts in case of failure.
    :param delay: Delay in seconds between retry attempts.
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
            response = requests.get(url, stream=True)
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


def extract_file(file_path: str, extracted_dir: str) -> None:
    """
    Extract a file (ZIP or TAR) to the specified directory.

    :param file_path: Path to the file to extract.
    :param extracted_dir: Directory where files will be extracted.
    """
    ensure_directory_exists(extracted_dir)
    clear_directory(extracted_dir)

    try:
        if file_path.endswith(".zip"):
            with zipfile.ZipFile(file_path, "r") as zip_ref:
                zip_ref.extractall(extracted_dir)
                logger.info(f"Extracted ZIP file to {extracted_dir}")
        elif file_path.endswith(".tar.gz") or file_path.endswith(".tgz"):
            with tarfile.open(file_path, "r:gz") as tar_ref:
                tar_ref.extractall(extracted_dir)
                logger.info(f"Extracted TAR file to {extracted_dir}")
        else:
            logger.warning(f"Unsupported file format: {file_path}")
    except Exception as e:
        logger.error(f"Error extracting file {file_path}: {e}")
        raise


def download_and_extract_files(
    url: str, raw_file_path: str, extracted_dir: str, chunk_size: int
) -> None:
    """
    Download a file and extract it if it is a supported format.

    :param url: URL of the file to download.
    :param raw_file_path: Path to save the downloaded file.
    :param extracted_dir: Directory where files will be extracted.
    :param chunk_size: Size of chunks for streaming the download.
    """
    download_file(url, raw_file_path, chunk_size)
    extract_file(raw_file_path, extracted_dir)


def stream_json(file_path: str):
    """
    Stream JSON file in a memory-efficient manner.

    :param file_path: Path to the JSON file.
    :yield: Parsed JSON records.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        for record in ijson.items(file, "item"):
            yield record
