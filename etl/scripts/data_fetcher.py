"""
File Download, Extraction, and JSON Streaming

This module provides utilities for:
- Downloading files with retry logic.
- Safely extracting ZIP and TAR files.
- Streaming JSON files in a memory-efficient manner.

Key Features:
- Prevents unsafe extractions outside the destination directory.
- Handles retries and chunked downloading for large files.
- Integrates with a configuration system for paths and settings.
"""

from pathlib import Path
import logging
import tarfile
import time
import zipfile

import requests

from etl.utils.file_system_utils import clear_directory, ensure_directory_exists
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Configurable constants
DEFAULT_CHUNK_SIZE = CONFIG.get("chunk_size", 1024 * 1024)


def ensure_safe_extraction(destination_dir: Path, member_name: str) -> bool:
    """Ensure extracted files remain within the destination directory.

    Args:
        destination_dir (Path): The directory where files are being extracted.
        member_name (str): The name of the file to be extracted.

    Returns:
        bool: True if the file is safe to extract; False otherwise.
    """
    extracted_path = (destination_dir / member_name).resolve()
    return extracted_path.is_relative_to(destination_dir.resolve())


def download_file(
    url: str,
    destination_path: Path,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    retries: int = 3,
    delay: int = 5,
) -> None:
    """Download a file with retries.

    Args:
        url (str): URL of the file to download.
        destination_path (Path): Path to save the downloaded file.
        chunk_size (int, optional): Size of chunks for streaming. Defaults to DEFAULT_CHUNK_SIZE.
        retries (int, optional): Number of retry attempts. Defaults to 3.
        delay (int, optional): Delay between retries in seconds. Defaults to 5.

    Raises:
        requests.RequestException: If download fails after all retries.
    """
    destination_path.parent.mkdir(parents=True, exist_ok=True)

    for attempt in range(retries):
        try:
            logger.info(
                f"Downloading file from {url} (Attempt {attempt + 1}/{retries})"
            )

            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()

            with destination_path.open("wb") as file:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    file.write(chunk)

            logger.info(f"File downloaded successfully to {destination_path}")
            return
        except requests.RequestException as e:
            logger.warning(f"Download failed (Attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                raise


def extract_zip(file_path: Path, extracted_dir: Path) -> None:
    """Extract a ZIP file to the specified directory."""
    with zipfile.ZipFile(file_path, "r") as zip_ref:
        for member in zip_ref.namelist():
            if ensure_safe_extraction(extracted_dir, member):
                zip_ref.extract(member, extracted_dir)
            else:
                logger.warning(f"Skipping unsafe file: {member}")
    logger.info(f"ZIP file extracted to {extracted_dir}")


def extract_tar(file_path: Path, extracted_dir: Path) -> None:
    """Extract a TAR file to the specified directory."""
    with tarfile.open(file_path, "r:gz") as tar_ref:
        for member in tar_ref.getmembers():
            if ensure_safe_extraction(extracted_dir, member.name):
                tar_ref.extract(member, extracted_dir)
            else:
                logger.warning(f"Skipping unsafe file: {member.name}")
    logger.info(f"TAR file extracted to {extracted_dir}")


def extract_file(file_path: Path, extracted_dir: Path) -> None:
    """Extract a ZIP or TAR file to a directory.

    Args:
        file_path (Path): Path to the file to extract.
        extracted_dir (Path): Directory to extract files.

    Raises:
        RuntimeError: If extraction fails or format is unsupported.
    """
    ensure_directory_exists(extracted_dir)
    clear_directory(extracted_dir)

    try:
        if file_path.suffix == ".zip":
            extract_zip(file_path, extracted_dir)
        elif file_path.suffixes == [".tar", ".gz"] or file_path.suffix == ".tgz":
            extract_tar(file_path, extracted_dir)
        else:
            raise ValueError(f"Unsupported file format: {file_path}")
    except (zipfile.BadZipFile, tarfile.TarError) as e:
        logger.error(f"Error extracting file {file_path}: {e}")
        raise RuntimeError(f"Extraction failed for {file_path}") from e


def download_and_extract_files(
    url: str,
    raw_file_path: Path,
    extracted_dir: Path,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
) -> None:
    """Download a file and extract it.

    Args:
        url (str): URL of the file to download.
        raw_file_path (Path): Path to save the downloaded file.
        extracted_dir (Path): Directory to extract files.
        chunk_size (int, optional): Size of chunks for streaming. Defaults to DEFAULT_CHUNK_SIZE.

    Raises:
        RuntimeError: If download or extraction fails.
    """
    download_file(url, raw_file_path, chunk_size)
    extract_file(raw_file_path, extracted_dir)


# This function is unused in the current implementation
# def stream_json(file_path: str) -> Generator[Dict[str, Any], None, None]:
#    """Stream JSON file content efficiently.
#
#    Args:
#        file_path (str): Path to the JSON file.
#
#    Yields:
#        dict: Parsed JSON objects.
#
#    Raises:
#        RuntimeError: If there is an error reading or parsing the file.
#    """
#    try:
#        with open(file_path, "r", encoding="utf-8") as file:
#            yield from ijson.items(file, "item")
#    except Exception as e:
#        logger.error(f"Error streaming JSON file {file_path}: {e}")
#        raise RuntimeError(f"Failed to stream JSON file {file_path}")
