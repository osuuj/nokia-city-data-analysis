"""
Utility functions for working with JSON files.

This module provides functions to identify and retrieve files
from a directory and to combine unzipping and JSON chunking into
a streamlined process. It integrates with `chunking_utils.py` for
handling large JSON files.
"""
import os
import logging
from etl.utils.chunking_utils import split_json_to_files

# Initialize logger for JSON utilities
logger = logging.getLogger('etl.json_utils')

def get_unzipped_file_name(extracted_dir):
    """Get the name of the file in the specified extracted directory."""
    try:
        files = [f for f in os.listdir(extracted_dir) if os.path.isfile(os.path.join(extracted_dir, f))]
        if len(files) == 1:
            return files[0]
        elif len(files) > 1:
            logger.error(f"Multiple files found in {extracted_dir}: {files}")
            raise ValueError(f"Multiple files found in {extracted_dir}: {files}")
        else:
            logger.error(f"No files found in {extracted_dir}.")
            raise FileNotFoundError(f"No files found in {extracted_dir}.")
    except Exception as e:
        logger.error(f"Error accessing directory {extracted_dir}: {e}")
        raise RuntimeError(f"Error accessing directory {extracted_dir}: {e}")

def split_and_process_json(extracted_dir, splitter_dir, chunk_size):
    """
    Combine steps to find the unzipped file, split it into chunks, and return the path to split files.

    :param extracted_dir: Directory containing unzipped files
    :param splitter_dir: Directory where split files will be saved
    :param chunk_size: Number of records per chunk
    :return: Path to the directory containing split files
    """
    try:
        # Get the unzipped file name
        unzipped_file_path = os.path.join(extracted_dir, get_unzipped_file_name(extracted_dir))

        # Prepare the directory for split files
        split_dir = os.path.join(splitter_dir, 'chunks')
        logger.info(f"Preparing to split unzipped file: {unzipped_file_path} into {split_dir}")
        split_json_to_files(unzipped_file_path, split_dir, chunk_size)

        return split_dir
    except Exception as e:
        logger.error(f"Error during split and process JSON: {e}")
        raise
