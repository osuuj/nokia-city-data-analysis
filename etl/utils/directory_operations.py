import os
import logging
from typing import List

logger = logging.getLogger(__name__)

def setup_directories(directories: List[str]) -> None:
    """Set up necessary directories."""
    logger.info("Setting up directories.")
    for directory in directories:
        try:
            ensure_directory_exists(directory)
        except Exception as e:
            logger.error(f"Error setting up directory {directory}: {e}")
    logger.info("Completed setting up directories.")

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    try:
        os.makedirs(path, exist_ok=True)
        logger.debug(f"Directory ensured: {path}")
    except Exception as e:
        logger.error(f"Failed to ensure directory {path}: {e}")
        raise

def clear_directory(directory: str) -> None:
    """Clear all files and directories in the specified directory."""
    try:
        if os.path.exists(directory):
            for root, dirs, files in os.walk(directory, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            logger.info(f"Cleared directory: {directory}")
        else:
            logger.warning(f"Directory does not exist: {directory}")
    except Exception as e:
        logger.error(f"Failed to clear directory {directory}: {e}")
        raise
