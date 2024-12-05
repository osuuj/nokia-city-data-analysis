import pandas as pd
import re

def clean_numeric_column(value):
    """Clean numeric values by removing trailing '.0' and converting to string."""
    try:
        if pd.isnull(value) or value == "":
            return None
        return str(int(float(value)))
    except (ValueError, TypeError):
        return str(value)

def transform_column_names(df):
    """Transforms column names into snake_case."""
    df.columns = [re.sub(r'([a-z])([A-Z])', r'\1_\2', col) for col in df.columns]
    df.columns = [re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', col) for col in df.columns]
    df.columns = [col.replace(" ", "_").lower() for col in df.columns]
    return df

def handle_missing_values(df):
    """Handles missing values in a DataFrame."""
    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(df[column], errors="coerce")
        else:
            df[column] = df[column].replace("", None)
    return df

def remove_duplicates(df):
    """Removes duplicate rows from the DataFrame."""
    return df.drop_duplicates()
