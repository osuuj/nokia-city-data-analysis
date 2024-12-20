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
import re
from typing import Any, Optional

import pandas as pd

logger = logging.getLogger(__name__)


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


def enforce_numeric_column(df: pd.DataFrame, column: str) -> pd.DataFrame:
    """Ensure a numeric column is properly formatted as nullable integer.

    Args:
        df (pd.DataFrame): The DataFrame containing the column.
        column (str): The name of the column to enforce numeric type.

    Returns:
        pd.DataFrame: The DataFrame with the column formatted as nullable integer.
    """
    if column in df.columns:
        df[column] = (
            pd.to_numeric(df[column], errors="coerce").fillna(pd.NA).astype("Int64")
        )
    return df


def clean_date_column(value: Any) -> Optional[str]:
    """Ensure date values are in ISO format.

    Args:
        value (Any): The date value to clean.

    Returns:
        Optional[str]: The cleaned date in ISO format, or None if invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        return pd.to_datetime(value, errors="coerce").isoformat()
    except Exception:
        return None


def clean_post_code(value: Any) -> Optional[str]:
    """Clean and standardize postal code values.

    Args:
        value (Any): The value to clean, typically numeric or string.

    Returns:
        Optional[str]: The cleaned postal code as a string, or None if invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        return str(int(float(value)))
    except (ValueError, TypeError):
        return None


def clean_apartment_number(value: Any) -> Optional[int]:
    """Clean apartment number by converting to integers.

    Args:
        value (Any): The value to clean, typically numeric or string.

    Returns:
        Optional[int]: The cleaned apartment number as an integer, or None if invalid.
    """
    try:
        if pd.isnull(value):
            return None
        return int(value)
    except (ValueError, TypeError):
        return None


def clean_building_number(value: str) -> Optional[str]:
    """Clean building number by standardizing format.

    Args:
        value (str): The value to clean.

    Returns:
        Optional[str]: The cleaned building number as a string, or None if invalid.
    """
    if pd.isnull(value) or value == "":
        return None
    return str(value).strip()


def clean_post_office_box(value: Any) -> Optional[str]:
    """Clean and standardize post office box values.

    Args:
        value (Any): The value to clean, typically numeric or string.

    Returns:
        Optional[str]: The cleaned post office box value as a string, or None if invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        return str(int(float(value)))
    except (ValueError, TypeError):
        return None


def transform_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Transform column names to snake_case without excessive underscores.

    Args:
        df (pd.DataFrame): The DataFrame whose column names will be transformed.

    Returns:
        pd.DataFrame: A new DataFrame with column names in snake_case.
    """
    new_columns = [
        re.sub(r"__+", "_", re.sub(r"([a-z])([A-Z])", r"\1_\2", col))
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]
    df.columns = pd.Index(new_columns)
    return df


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values in a DataFrame by replacing empty strings with None and parsing dates.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: A DataFrame with missing values handled.
    """
    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(df[column], errors="coerce")
        else:
            df[column] = df[column].replace("", None)
    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from a DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: A deduplicated DataFrame.
    """
    return df.drop_duplicates()
