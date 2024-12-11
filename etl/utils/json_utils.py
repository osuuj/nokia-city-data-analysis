"""Utility functions for working with JSON files.

This module provides functions to identify and retrieve files
from a directory and to combine unzipping and JSON chunking into
a streamlined process. It integrates with `chunking_utils.py` for
handling large JSON files.
"""

import logging
from pathlib import Path
from typing import List
from etl.utils.chunking_utils import split_json_to_files
from etl.utils.file_system_utils import ensure_directory_exists

# Initialize logger for JSON utilities
logger = logging.getLogger("etl.json_utils")


class JsonProcessingError(Exception):
    """Custom exception for JSON processing errors."""

    pass


def get_unzipped_file_name(extracted_dir: str) -> str:
    """Get the name of the single file in the specified extracted directory.

    Args:
        extracted_dir (str): Path to the directory containing extracted files.

    Returns:
        str: Name of the single file in the directory.

    Raises:
        ValueError: If multiple files are found in the directory.
        FileNotFoundError: If no files are found in the directory.
        JsonProcessingError: If there is an error accessing the directory.
    """
    try:
        directory = Path(extracted_dir)
        files: List[Path] = [f for f in directory.iterdir() if f.is_file()]

        if len(files) == 1:
            logger.debug(f"Single file found in {extracted_dir}: {files[0].name}")
            return files[0].name
        elif len(files) > 1:
            raise ValueError(
                f"Multiple files found in {extracted_dir}: {[f.name for f in files]}"
            )
        else:
            raise FileNotFoundError(f"No files found in {extracted_dir}.")
    except Exception as e:
        logger.error(f"Error accessing directory {extracted_dir}: {e}")
        raise JsonProcessingError(
            f"Error accessing directory {extracted_dir}: {e}"
        ) from e


def split_and_process_json(
    extracted_dir: str, splitter_dir: str, chunk_size: int
) -> str:
    """Find the unzipped file, split it into chunks, and return the path to split files.

    Args:
        extracted_dir (str): Directory containing unzipped files.
        splitter_dir (str): Directory where split files will be saved.
        chunk_size (int): Number of records per chunk.

    Returns:
        str: Path to the directory containing split files.

    Raises:
        JsonProcessingError: If there is an error during the split-and-process operation.
    """
    try:
        # Get the unzipped file name
        unzipped_file_path = Path(extracted_dir) / get_unzipped_file_name(extracted_dir)

        # Prepare the directory for split files
        split_dir = Path(splitter_dir) / "chunks"
        ensure_directory_exists(split_dir)

        logger.info(
            f"Splitting unzipped file: {unzipped_file_path} into chunks at {split_dir}"
        )
        split_json_to_files(str(unzipped_file_path), str(split_dir), chunk_size)

        logger.info(f"JSON splitting completed. Chunks saved to: {split_dir}")
        return str(split_dir)
    except Exception as e:
        logger.error(f"Error during split and process JSON: {e}")
        raise JsonProcessingError(f"Error during split and process JSON: {e}") from e
