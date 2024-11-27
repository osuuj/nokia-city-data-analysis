import pandas as pd
from typing import Dict, Any, List

def filter_english_descriptions(descriptions: List[Dict[str, Any]]) -> List[str]:
    """Extract English descriptions only."""
    return [desc['description'] for desc in descriptions if desc['languageCode'] == "3"]

def handle_missing_values(df, default_values):
    """
    Fill missing values in a DataFrame using a dictionary of default values.
    """
    for col, default in default_values.items():
        if col in df.columns:
            # Directly set missing values to None if default is None
            if default is None:
                df[col] = df[col].where(df[col].notna(), None)
            else:
                # Use fillna for other default values
                df[col] = df[col].fillna(default)
    return df

def map_column_values(df, column, mapping_function, fallback="Unknown"):
    """
    Map a column in a DataFrame using a specified mapping function.

    Args:
        df (pd.DataFrame): The DataFrame to process.
        column (str): The column to map.
        mapping_function (function): The mapping function to apply.
        fallback (str): The default value for unmapped entries.

    Returns:
        pd.DataFrame: The updated DataFrame with mapped values.
    """
    if column in df.columns:
        df[column] = df[column].apply(lambda x: mapping_function(x) if x is not None else fallback)
    else:
        raise KeyError(f"Column '{column}' not found in the DataFrame.")
    return df

def format_date(date_str):
    """
    Convert a date string to YYYY-MM-DD format.
    
    Args:
        date_str (str): The input date string.

    Returns:
        str or None: The formatted date as a string in YYYY-MM-DD format, or None if invalid.
    """
    try:
        # Convert to datetime, handle errors, and format
        return pd.to_datetime(date_str, errors="coerce").strftime("%Y-%m-%d")
    except (ValueError, TypeError, AttributeError):
        return None
