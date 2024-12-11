"""Company-specific data extraction utilities.

This module provides functionality to process JSON files in a directory
and convert them into pandas DataFrames. Extracted data can be saved to
CSV files in manageable chunks for downstream processing.
"""

import json
import logging
from pathlib import Path

import pandas as pd

logger = logging.getLogger(__name__)


def process_json_directory(directory_path: str) -> pd.DataFrame:
    """Process JSON files in a directory into a single DataFrame.

    Args:
        directory_path (str): Path to the directory containing JSON files.

    Returns:
        pd.DataFrame: A DataFrame containing combined data from JSON files.

    Raises:
        FileNotFoundError: If the directory does not exist.
    """
    directory = Path(directory_path)
    if not directory.exists():
        raise FileNotFoundError(f"Directory does not exist: {directory_path}")

    all_rows = []
    for file_path in directory.glob("*.json"):
        with file_path.open("r", encoding="utf-8") as file:
            data = json.load(file)
            if isinstance(data, list):
                all_rows.extend(data)
            else:
                logger.warning(f"Skipping file {file_path}: not a list")
    return pd.DataFrame(all_rows)
