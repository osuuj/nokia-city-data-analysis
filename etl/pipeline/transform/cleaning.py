"""Entity Data Cleaning Utilities

This module provides functionality for cleaning datasets and handling
CSV files for specific entities. It supports both general cleaning steps
and entity-specific transformations.
"""

from pathlib import Path
from typing import Optional, List

import pandas as pd

from etl.utils.cleaning_utils import (
    clean_numeric_column,
    handle_missing_values,
    remove_duplicates,
    transform_column_names,
)

import logging

logger = logging.getLogger(__name__)


def clean_dataset(
    df: pd.DataFrame, entity_name: str, specific_columns: Optional[List[str]] = None
) -> pd.DataFrame:
    """Cleans a dataset by applying general and entity-specific transformations.

    Args:
        df (pd.DataFrame): The DataFrame to clean.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (Optional[List[str]]): Columns requiring specific cleaning (e.g., numeric columns).

    Returns:
        pd.DataFrame: The cleaned DataFrame.

    Raises:
        ValueError: If there is an error during dataset cleaning.
    """
    try:
        # Transform column names to snake_case
        df = transform_column_names(df)

        # Entity-specific cleaning
        if entity_name == "addresses" and specific_columns:
            for column in specific_columns:
                if column in df.columns:
                    df[column] = df[column].apply(clean_numeric_column)

        # General cleaning steps
        df = handle_missing_values(df)
        df = remove_duplicates(df)

    except Exception as e:
        logger.error(f"Error during cleaning dataset for entity '{entity_name}': {e}")
        raise ValueError(
            f"Error during cleaning dataset for entity '{entity_name}': {e}"
        )

    return df


def clean_entity_files(
    extracted_path: str,
    cleaned_path: str,
    entity_name: str,
    specific_columns: Optional[List[str]] = None,
) -> List[str]:
    """Cleans all CSV files for a specific entity.

    Args:
        extracted_path (str): Path to the extracted data.
        cleaned_path (str): Path to save the cleaned data.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (Optional[List[str]]): Columns requiring specific cleaning (e.g., numeric columns).

    Returns:
        List[str]: List of paths to cleaned files.

    Raises:
        ValueError: If there is an error cleaning a specific file.
        RuntimeError: If there is an error during the overall cleaning process.
    """
    input_dir = Path(extracted_path) / entity_name
    output_dir = Path(cleaned_path) / entity_name
    output_dir.mkdir(parents=True, exist_ok=True)

    if not input_dir.exists():
        logger.error(f"Input directory does not exist: {input_dir}")
        raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

    cleaned_files = []

    try:
        for file_path in input_dir.glob("*.csv"):
            output_file = output_dir / file_path.name

            try:
                df = pd.read_csv(file_path)
                cleaned_df = clean_dataset(df, entity_name, specific_columns)
                cleaned_df.to_csv(output_file, index=False)
                cleaned_files.append(str(output_file))
                logger.info(f"Cleaned file saved: {output_file}")
            except Exception as e:
                logger.error(f"Error cleaning file {file_path}: {e}")
                raise ValueError(f"Failed to clean file '{file_path.name}': {e}")

    except Exception as e:
        logger.error(f"Error while cleaning files for entity '{entity_name}': {e}")
        raise RuntimeError(
            f"Error while cleaning files for entity '{entity_name}': {e}"
        )

    return cleaned_files
