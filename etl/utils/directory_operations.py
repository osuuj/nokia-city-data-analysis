import os
import logging

logger = logging.getLogger(__name__)

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    try:
        os.makedirs(path, exist_ok=True)
        logger.info(f"Directory ensured: {os.path.basename(path)}")
    except Exception as e:
        logger.error(f"Failed to ensure directory {os.path.basename(path)}: {e}")
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
            logger.info(f"Cleared old extracted files in {os.path.basename(directory)}")
        else:
            logger.warning(f"Directory does not exist: {os.path.basename(directory)}")
    except Exception as e:
        logger.error(f"Failed to clear directory {os.path.basename(directory)}: {e}")
        raise
