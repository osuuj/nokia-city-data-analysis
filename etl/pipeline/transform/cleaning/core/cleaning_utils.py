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

import pandas as pd

logger = logging.getLogger(__name__)


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
