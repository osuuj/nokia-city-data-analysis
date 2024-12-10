"""Utility functions for managing files and directories.

This module provides functions to ensure directory existence,
set up multiple directories, clear directory contents, and check
if directories are empty. These utilities are designed to handle
common file system operations in a robust and reusable manner.
"""

import logging
import os
from typing import List

logger = logging.getLogger(__name__)


def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists.

    Args:
        path (str): The path of the directory to ensure exists.

    Raises:
        OSError: If the directory cannot be created.
    """
    try:
        os.makedirs(path, exist_ok=True)
        logger.debug(f"Ensured directory exists: {path}")
    except OSError as e:
        logger.error(f"Failed to create directory {path}: {e}")
        raise


def setup_directories(directories: List[str]) -> None:
    """Ensure that a list of directories exist.

    Args:
        directories (List[str]): A list of directory paths to ensure exist.
    """
    for directory in directories:
        ensure_directory_exists(directory)
        logger.info(f"Setup directory: {directory}")


def clear_directory(directory: str) -> None:
    """Clear all files and subdirectories in the specified directory.

    Args:
        directory (str): The directory to clear.

    Raises:
        OSError: If clearing files or directories fails.
    """
    if not os.path.exists(directory):
        logger.debug(f"Directory does not exist, nothing to clear: {directory}")
        return

    for root, dirs, files in os.walk(directory, topdown=False):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            try:
                os.remove(file_path)
                logger.debug(f"Removed file: {file_path}")
            except OSError as e:
                logger.error(f"Failed to remove file {file_path}: {e}")
                raise
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            try:
                os.rmdir(dir_path)
                logger.debug(f"Removed directory: {dir_path}")
            except OSError as e:
                logger.error(f"Failed to remove directory {dir_path}: {e}")
                raise

    logger.info(f"Cleared directory: {directory}")


def is_empty_directory(directory: str) -> bool:
    """Check if a directory is empty.

    Args:
        directory (str): The directory to check.

    Returns:
        bool: True if the directory exists and is empty, False otherwise.
    """
    if not os.path.exists(directory):
        logger.debug(f"Directory does not exist: {directory}")
        return False

    is_empty = not os.listdir(directory)
    logger.debug(f"Directory '{directory}' is {'empty' if is_empty else 'not empty'}.")
    return is_empty
