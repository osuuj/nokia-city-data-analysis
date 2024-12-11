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
    """Transforms column names into snake_case.

    Args:
        df (pd.DataFrame): The DataFrame whose columns need to be transformed.

    Returns:
        pd.DataFrame: The DataFrame with updated column names.
    """
    snake_case_columns = [
        re.sub(r"([a-z])([A-Z])", r"\1_\2", col) for col in df.columns
    ]
    snake_case_columns = [
        re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", col) for col in snake_case_columns
    ]
    snake_case_columns = [col.replace(" ", "_").lower() for col in snake_case_columns]
    df.columns = snake_case_columns
    return df


def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handles missing values in a DataFrame.

    Converts empty strings to None and parses date columns.

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
    """Removes duplicate rows from the DataFrame.

    Args:
        df (pd.DataFrame): The DataFrame to deduplicate.

    Returns:
        pd.DataFrame: The deduplicated DataFrame.
    """
    return df.drop_duplicates()
