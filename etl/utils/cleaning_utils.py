"""
Data Cleaning Utilities

This module provides essential utility functions for data cleaning and transformation 
tasks commonly required in ETL pipelines. These include numeric value sanitization, 
column name standardization, handling missing values, and removing duplicates.

Key Features:
- Ensures consistent column naming using `snake_case`.
- Handles missing values flexibly, with specific handling for date columns.
- Cleans numeric data by removing unwanted characters and formats.
- Deduplicates rows to ensure data integrity.
"""

import re
from typing import Any, Optional

import pandas as pd


def clean_numeric_column(value: Any) -> Optional[str]:
    """Clean numeric values by removing trailing '.0' and converting to string.

    Args:
        value (Any): The value to clean.

    Returns:
        Optional[str]: The cleaned value as a string, or None if the value is invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        return str(int(float(value)))
    except (ValueError, TypeError):
        return str(value)


def transform_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Transform column names into snake_case.

    Args:
        df (pd.DataFrame): The DataFrame whose columns need transformation.

    Returns:
        pd.DataFrame: The DataFrame with updated column names.
    """
    df.columns = [
        re.sub(r"([a-z])([A-Z])|([A-Z]+)([A-Z][a-z])", r"\1_\2\3_\4", col)
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]
    return df


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values in a DataFrame.

    - Converts empty strings to None.
    - Attempts to parse date columns.

    Args:
        df (pd.DataFrame): The DataFrame to handle missing values.

    Returns:
        pd.DataFrame: The updated DataFrame with missing values handled.
    """
    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(df[column], errors="coerce")
        else:
            df[column] = df[column].replace("", None)
    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from the DataFrame.

    Args:
        df (pd.DataFrame): The DataFrame to deduplicate.

    Returns:
        pd.DataFrame: The deduplicated DataFrame.
    """
    return df.drop_duplicates()
