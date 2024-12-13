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


def process_json_directory(json_file: Path) -> pd.DataFrame:
    """Process a JSON file into a DataFrame.

    Args:
        json_file (Path): The JSON file to process.

    Returns:
        pd.DataFrame: A DataFrame containing combined data from the JSON file.
    """
    all_rows = []
    try:
        with json_file.open("r", encoding="utf-8") as file:
            data = json.load(file)
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        all_rows.append(item)
                    else:
                        logger.error(
                            f"Unexpected data type in {json_file}: {type(item)}. Expected dict."
                        )
            else:
                logger.error(f"Expected a list in {json_file}, got {type(data)}")
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON in {json_file}: {e}")
    return pd.DataFrame(all_rows)
