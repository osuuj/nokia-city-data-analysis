"""Data Cleaning Utilities.

This module provides utility functions for cleaning and transforming data in ETL pipelines. 
It includes methods for column name standardization, handling missing values, cleaning numeric data, 
and removing duplicates to ensure data integrity.

Key Features:
- Consistent column naming using `snake_case`.
- Flexible handling of missing values with special care for date columns.
- Cleaning and formatting numeric data.
- Deduplication of rows.
"""

import re
import pandas as pd
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def clean_numeric_column(value: Any) -> Optional[str]:
    """Clean numeric values by converting them to strings and removing trailing ".0".

    Args:
        value (Any): The value to clean. Typically a numeric or string value.

    Returns:
        Optional[str]: The cleaned value as a string, or None if the input is invalid.
    """
    try:
        if pd.isnull(value) or value == "":
            return None
        return str(int(float(value)))
    except (ValueError, TypeError):
        return str(value) if value else None


def transform_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Transform DataFrame column names to snake_case.

    Args:
        df (pd.DataFrame): The DataFrame whose column names will be transformed.

    Returns:
        pd.DataFrame: A new DataFrame with column names in snake_case.
    """
    df.columns = [
        re.sub(r"([a-z])([A-Z])|([A-Z]+)([A-Z][a-z])", r"\1_\2\3_\4", col)
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]
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
