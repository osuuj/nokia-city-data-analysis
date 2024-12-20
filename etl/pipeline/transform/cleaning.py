"""Entity Data Cleaning Utilities.

This module provides functionality for cleaning datasets and handling
CSV files for specific entities. It supports both general cleaning steps
and entity-specific transformations.
"""

import logging
from pathlib import Path
from typing import List, Optional

import pandas as pd

from etl.utils.cleaning_utils import (
    clean_numeric_column,
    handle_missing_values,
    remove_duplicates,
    transform_column_names,
)

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
        ValueError: If there is an error during the cleaning process.
    """
    specific_columns = specific_columns or []  # Default to empty list if None

    try:
        # Transform column names to snake_case
        df = transform_column_names(df)

        # Apply entity-specific transformations
        if entity_name == "addresses":
            df = clean_addresses(df)
        elif entity_name == "companies":
            df = clean_companies(df)
        elif entity_name == "registered_entries":
            df = clean_registered_entries(df)

        # Clean dates vectorized
        date_columns = [col for col in df.columns if "date" in col.lower()]
        for col in date_columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

        # General cleaning
        df = handle_missing_values(df)
        df = remove_duplicates(df)

    except Exception as e:
        logger.error(f"Error during cleaning dataset for entity '{entity_name}': {e}")
        raise ValueError(
            f"Error during cleaning dataset for entity '{entity_name}': {e}"
        )

    return df


def clean_registered_entries(df: pd.DataFrame) -> pd.DataFrame:
    """Custom cleaning logic for registered entries.

    Args:
        df (pd.DataFrame): DataFrame for the registered entries entity.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    # Validate 'type' column to ensure it contains only numeric values
    df["type"] = pd.to_numeric(df["type"], errors="coerce")
    df = df.dropna(subset=["type"])
    df["type"] = df["type"].astype(int)
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
        FileNotFoundError: If the input directory does not exist.
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


def clean_addresses(df: pd.DataFrame) -> pd.DataFrame:
    """Custom cleaning logic for addresses.

    Args:
        df (pd.DataFrame): DataFrame for the addresses entity.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    if "post_code" in df.columns:
        df["post_code"] = df["post_code"].apply(clean_numeric_column)
    if "apartment_number" in df.columns:
        df["apartment_number"] = df["apartment_number"].apply(clean_numeric_column)
    return df


def clean_companies(df: pd.DataFrame) -> pd.DataFrame:
    """Custom cleaning logic for companies.

    Args:
        df (pd.DataFrame): DataFrame for the companies entity.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    if "lastModified" in df.columns:
        df = df.rename(columns={"lastModified": "last_modified"})
        df["last_modified"] = pd.to_datetime(df["last_modified"]).dt.date
    return df
