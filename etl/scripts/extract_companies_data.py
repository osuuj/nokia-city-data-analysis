"""
Company-specific data extraction utilities.

This module provides functionality to process JSON files in a directory
and convert them into pandas DataFrames. Extracted data can be saved to
CSV files in manageable chunks for downstream processing.
"""

import json
import logging
import os

import pandas as pd

logger = logging.getLogger(__name__)


def process_json_directory(directory_path: str) -> pd.DataFrame:
    """
    Process JSON files in a directory into a DataFrame.

    :param directory_path: Path to the directory containing JSON files.
    :return: A DataFrame containing combined data from JSON files.
    """
    all_rows = []
    for file_name in os.listdir(directory_path):
        if file_name.endswith(".json"):
            file_path = os.path.join(directory_path, file_name)
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    if isinstance(data, list):
                        all_rows.extend(data)
                    else:
                        logger.error(
                            f"Expected a list in {file_path}, got {type(data)}"
                        )
            except json.JSONDecodeError as e:
                logger.error(f"Error decoding JSON in {file_path}: {e}")
    return pd.DataFrame(all_rows)
