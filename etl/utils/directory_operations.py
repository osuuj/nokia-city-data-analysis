import os
import logging

def ensure_directory_exists(path: str) -> None:
    """Ensure that a directory exists."""
    os.makedirs(path, exist_ok=True)

def clear_directory(directory: str) -> None:
    """Clear all files and directories in the specified directory."""
    if os.path.exists(directory):
        for root, dirs, files in os.walk(directory, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        logging.info(f"Cleared old extracted files in {os.path.basename(directory)}")
