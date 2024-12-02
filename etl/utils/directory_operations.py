import os
import logging
from typing import List

logger = logging.getLogger(__name__)

def setup_directories(directories: List[str]) -> None:
    """Ensure that a list of directories exist."""
    for directory in directories:
        ensure_directory_exists(directory)
        logger.info(f"Setup directory: {directory}")

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    try:
        os.makedirs(path, exist_ok=True)
        logger.debug(f"Directory ensured: {path}")
    except Exception as e:
        logger.error(f"Failed to ensure directory {path}: {e}")
        raise

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
        else:
            logger.warning(f"Directory does not exist: {directory}")
            return False
    except Exception as e:
        logger.error(f"Failed to clear directory {directory}: {e}")
        return False

def is_empty_directory(directory: str) -> bool:
    """Check if a directory is empty."""
    return os.path.exists(directory) and not os.listdir(directory)
