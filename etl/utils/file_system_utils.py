"""
Utility functions for managing files and directories.

This module provides functions to ensure directory existence,
set up multiple directories, clear directory contents, and check
if directories are empty. These utilities are designed to handle
common file system operations in a robust and reusable manner.
"""
import os
import logging
from typing import List

logger = logging.getLogger(__name__)

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    try:
        os.makedirs(path, exist_ok=True)
        logger.debug(f"Directory ensured: {path}")
    except Exception as e:
        logger.error(f"Failed to ensure directory {path}: {e}")
        raise

def setup_directories(directories: List[str]) -> None:
    """Ensure that a list of directories exist."""
    for directory in directories:
        ensure_directory_exists(directory)
        logger.info(f"Setup directory: {directory}")

def clear_directory(directory: str) -> bool:
    """Clear all files and directories in the specified directory."""
    try:
        if os.path.exists(directory):
            for root, dirs, files in os.walk(directory, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            logger.info(f"Cleared directory: {directory}")
            return True
        logger.warning(f"Directory does not exist: {directory}")
        return False
    except Exception as e:
        logger.error(f"Failed to clear directory {directory}: {e}")
        return False

def is_empty_directory(directory: str) -> bool:
    """Check if a directory is empty."""
    return os.path.exists(directory) and not os.listdir(directory)
