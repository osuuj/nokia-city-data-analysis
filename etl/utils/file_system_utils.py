"""
Utility functions for managing files and directories.

This module provides functions to ensure directory existence,
set up multiple directories, clear directory contents, and check
if directories are empty. These utilities are designed to handle
common file system operations in a robust and reusable manner.
"""

from pathlib import Path
import logging
from typing import List

logger = logging.getLogger(__name__)


def ensure_directory_exists(path: Path) -> None:
    """Ensure that a directory exists.

    Args:
        path (Path): The path of the directory to ensure exists.

    Raises:
        OSError: If the directory cannot be created.
    """
    try:
        path.mkdir(parents=True, exist_ok=True)
        logger.debug(f"Ensured directory exists: {path}")
    except OSError as e:
        logger.error(f"Failed to create directory {path}: {e}")
        raise


def setup_directories(directories: List[Path]) -> None:
    """Ensure that a list of directories exist.

    Args:
        directories (List[Path]): A list of directory paths to ensure exist.
    """
    for directory in directories:
        ensure_directory_exists(directory)
        logger.info(f"Setup directory: {directory}")


def clear_directory(directory: Path) -> None:
    """Clear all files and subdirectories in the specified directory.

    Args:
        directory (Path): The directory to clear.

    Raises:
        OSError: If clearing files or directories fails.
    """
    if not directory.exists():
        logger.debug(f"Directory does not exist, nothing to clear: {directory}")
        return

    for item in directory.iterdir():
        try:
            if item.is_file():
                item.unlink()
                logger.debug(f"Removed file: {item}")
            elif item.is_dir():
                clear_directory(item)
                item.rmdir()
                logger.debug(f"Removed directory: {item}")
        except OSError as e:
            logger.error(f"Failed to remove {item}: {e}")
            raise

    logger.info(f"Cleared directory: {directory}")


def is_empty_directory(directory: Path) -> bool:
    """Check if a directory is empty.

    Args:
        directory (Path): The directory to check.

    Returns:
        bool: True if the directory exists and is empty, False otherwise.
    """
    if not directory.exists():
        logger.debug(f"Directory does not exist: {directory}")
        return False

    is_empty = not any(directory.iterdir())
    logger.debug(f"Directory '{directory}' is {'empty' if is_empty else 'not empty'}.")
    return is_empty
