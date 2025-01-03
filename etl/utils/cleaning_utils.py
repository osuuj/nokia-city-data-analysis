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
import pandas as pd
from typing import Any, Optional, List, Dict

logger = logging.getLogger(__name__)

def validate_against_schema(df: pd.DataFrame, entity_name: str, entities_config: Dict[str, Any]) -> pd.DataFrame:
    """Validate DataFrame against the schema defined in entities_config.

    Args:
        df (pd.DataFrame): The DataFrame to validate.
        entity_name (str): The name of the entity being validated.
        entities_config (Dict[str, Any]): Configuration for entities including validation schema.

    Returns:
        pd.DataFrame: The validated DataFrame.

    Raises:
        ValueError: If the validation schema is not defined for the entity.
    """
    entity_config = next((entity for entity in entities_config if entity["name"] == entity_name), None)
    if not entity_config or "validation" not in entity_config:
        raise ValueError(f"No validation schema defined for entity '{entity_name}'")

    validation_schema = entity_config["validation"]
    required_columns = validation_schema.get("required", [])
    column_types = validation_schema.get("columns", {})

    for column in required_columns:
        if column not in df.columns:
            raise ValueError(f"Missing required column '{column}' in entity '{entity_name}'")

    # Validate column data types
    for column, col_type in column_types.items():
        if column in df.columns:
            if "DATE" in col_type:
                df[column] = pd.to_datetime(df[column], errors="coerce").dt.date
            elif "VARCHAR" in col_type or "CHAR" in col_type:
                df[column] = df[column].astype(str).replace("", None)
            elif "INT" in col_type:
                df[column] = pd.to_numeric(df[column], errors="coerce", downcast="integer")
            elif "BOOLEAN" in col_type:
                df[column] = df[column].astype(bool)

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


def clean_registered_entries(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for registered entries.

    Args:
        df (pd.DataFrame): DataFrame for the registered entries entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    # Validate 'type' column to ensure it contains only numeric values
    df["type"] = pd.to_numeric(df["type"], errors="coerce")
    df = df.dropna(subset=["type"])
    df["type"] = df["type"].astype(int)

    # Apply specific column cleaning
    for column in specific_columns:
        if column in df.columns:
            df[column] = pd.to_datetime(df[column], errors="coerce").dt.date

    return df

def clean_registered_entry_descriptions(df: pd.DataFrame) -> pd.DataFrame:
    """Custom cleaning logic for registered entry descriptions.

    Args:
        df (pd.DataFrame): DataFrame for the registered entry descriptions entity.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    df["entry_type"] = pd.to_numeric(df["entry_type"], errors="coerce")
    df = df.dropna(subset=["entry_type"])
    df["entry_type"] = df["entry_type"].astype(int)
    return df


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


def clean_companies(df: pd.DataFrame, specific_columns: List[str]) -> pd.DataFrame:
    """Custom cleaning logic for companies.

    Args:
        df (pd.DataFrame): DataFrame for the companies entity.
        specific_columns (List[str]): Columns requiring specific cleaning.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    
    for column in specific_columns:
        if column in specific_columns and column in df.columns:
            df[column] = pd.to_datetime(df[column], errors="coerce").dt.date
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
