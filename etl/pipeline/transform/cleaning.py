"""Entity Data Cleaning Utilities.

This module provides functionality for cleaning datasets and handling
CSV files for specific entities. It supports both general cleaning steps
and entity-specific transformations.
"""

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd

from etl.utils.cleaning_utils import (
    clean_addresses,
    clean_company_forms,
    clean_main_business_lines,
    clean_names,
    clean_post_offices,
    handle_missing_values,
    remove_duplicates,
    transform_column_names,
    validate_against_schema,
)

logger = logging.getLogger(__name__)


def clean_dataset(
    df: pd.DataFrame,
    entity_name: str,
    specific_columns: Optional[List[str]] = None,
    entities_config: Optional[List[Dict[str, Any]]] = None,
) -> pd.DataFrame:
    """Cleans a dataset by applying general and entity-specific transformations.

    Args:
        df (pd.DataFrame): The DataFrame to clean.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (Optional[List[str]]): Columns requiring specific cleaning (e.g., numeric columns).
        entities_config (Optional[List[Dict[str, Any]]]): Configuration for entities including validation schema.

    Returns:
        pd.DataFrame: The cleaned DataFrame.

    Raises:
        ValueError: If there is an error during the cleaning process.
    """
    specific_columns = specific_columns or []  # Default to empty list if None

    try:
        # Transform column names to snake_case
        df = transform_column_names(df)

        # General cleaning
        df = handle_missing_values(df)
        df = remove_duplicates(df)

        # Apply entity-specific transformations
        if entity_name == "addresses":
            df = clean_addresses(df, specific_columns)
        elif entity_name == "post_offices":
            df = clean_post_offices(df, specific_columns)
        elif entity_name == "company_forms":
            df = clean_company_forms(df, specific_columns)
        elif entity_name == "names":
            df = clean_names(df, specific_columns)
        elif entity_name == "main_business_lines":
            df = clean_main_business_lines(df, specific_columns)

        # Validate against schema
        if entities_config:
            df = validate_against_schema(df, entity_name, entities_config)

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
    entities_config: Optional[List[Dict[str, Any]]] = None,
) -> List[str]:
    """Cleans all CSV files for a specific entity.

    Args:
        extracted_path (str): Path to the extracted data.
        cleaned_path (str): Path to save the cleaned data.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (Optional[List[str]]): Columns requiring specific cleaning (e.g., numeric columns).
        entities_config (Optional[List[Dict[str, Any]]]): Configuration dictionary for entities.

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
                cleaned_df = clean_dataset(
                    df, entity_name, specific_columns, entities_config
                )
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
