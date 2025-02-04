"""Data Cleaning Utilities.

This module provides utility functions for cleaning and transforming data in ETL pipelines.
It includes methods for column name standardization, handling missing values, cleaning numeric data,
and removing duplicates to ensure data integrity. Additionally, it provides specific cleaning logic
for key address-related columns such as postal codes and apartment numbers.

Key Features:
- Consistent column naming using `snake_case`.
- Flexible handling of missing values with special care for date columns.
- Cleaning and formatting numeric data, including specific columns like `post_code`.
- Deduplication of rows for data integrity.
"""

import logging
from typing import Any, Dict, List, Optional

import pandas as pd

logger = logging.getLogger(__name__)


def validate_against_schema(
    df: pd.DataFrame, entity_name: str, entities_config: List[Dict[str, Any]]
) -> pd.DataFrame:
    """Validate DataFrame against the schema defined in entities_config.

    Args:
        df (pd.DataFrame): The DataFrame to validate.
        entity_name (str): The name of the entity being validated.
        entities_config (List[Dict[str, Any]]): Configuration for entities including validation schema.

    Returns:
        pd.DataFrame: The validated DataFrame.

    Raises:
        ValueError: If the validation schema is not defined for the entity.
    """
    entity_config = next(
        (entity for entity in entities_config if entity["name"] == entity_name), None
    )
    if not entity_config or "validation" not in entity_config:
        raise ValueError(f"Validation schema not defined for entity: {entity_name}")

    validation_schema = entity_config["validation"]
    required_columns = validation_schema.get("required", [])
    column_types = validation_schema.get("columns", {})

    # Validate required columns
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    # Validate column types
    for column, expected_type in column_types.items():
        if column in df.columns:
            if not pd.api.types.is_dtype_equal(df[column].dtype, expected_type):
                raise ValueError(
                    f"Column '{column}' expected type '{expected_type}' but got '{df[column].dtype}'"
                )

    return df


def clean_numeric_column(value: Any) -> Optional[str]:
    """Clean numeric values by converting to integers if valid, otherwise return None.

    Args:
        value (Any): The value to clean, typically numeric or string.

    Returns:
        Optional[int]: The cleaned value as an integer, or None if invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        value = float(value)
        if value.is_integer():
            return str(int(value))
        return str(value)
    except (ValueError, TypeError):
        return None


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values in a DataFrame by replacing empty strings with None and parsing dates.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: A DataFrame with missing values handled.
    """
    df = df.copy()  # Work with a copy to avoid SettingWithCopyWarning

    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(df[column], errors="coerce")
        elif df[column].dtype == "object":
            df[column] = df[column].replace("", None)
        elif df[column].dtype in ["int64", "float64"]:
            df[column] = df[column].replace("", None).astype(float)

    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from a DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: A deduplicated DataFrame.
    """
    return df.drop_duplicates()


def clean_addresses(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for addresses.

    Args:
        df (pd.DataFrame): DataFrame for the addresses entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    for column in specific_columns:
        if column in df.columns:
            df[column] = df[column].apply(clean_numeric_column)
    return df


def clean_company_forms(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for company forms.

    Args:
        df (pd.DataFrame): DataFrame for the company forms entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    for column in specific_columns:
        if column in df.columns:
            df[column] = df[column].apply(clean_numeric_column)
    return df


def clean_main_business_lines(
    df: pd.DataFrame, specific_columns: List[str]
) -> pd.DataFrame:
    """Custom cleaning logic for main business lines.

    Args:
        df (pd.DataFrame): DataFrame for the main business lines entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    for column in specific_columns:
        if column in df.columns:
            df[column] = df[column].apply(clean_numeric_column)
    return df


def clean_names(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for names.

    Args:
        df (pd.DataFrame): DataFrame for the names entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    for column in specific_columns:
        if column in df.columns:
            df[column] = df[column].apply(clean_numeric_column)
    return df


def clean_post_offices(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for post offices.

    Args:
        df (pd.DataFrame): DataFrame for the post offices entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    for column in specific_columns:
        if column in df.columns:
            df[column] = df[column].apply(clean_numeric_column)
    return df


def normalize_postal_codes(
    df: pd.DataFrame, column_name: str = "postal_code"
) -> pd.DataFrame:
    """Ensure all 'postal_code' values are 5 digits long by prepending zeros where necessary.

    Args:
        df (pd.DataFrame): The input DataFrame.
        column_name (str): The name of the postal code column. Defaults to "postal_code".

    Returns:
        pd.DataFrame: The DataFrame with normalized 'postal_code' values.
    """
    if column_name in df.columns:
        df[column_name] = df[column_name].fillna(0).astype(int).astype(str).str.zfill(5)
    else:
        logger.warning(f"Column '{column_name}' not found in DataFrame.")
    return df


def remove_invalid_post_codes(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows where the 'post_code' column has the value 0.0.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with invalid rows removed.
    """
    if "post_code" in df.columns:
        df = df[df["post_code"] != 0.0]
    return df
