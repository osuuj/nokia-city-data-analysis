import pandas as pd
import re
import yaml

def load_mappings(file_path):
    """
    Load mappings from a YAML configuration file.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return yaml.safe_load(file)

def transform_column_names(df):
    """
    Transforms column names into snake_case.
    """
    df.columns = [re.sub(r'([a-z])([A-Z])', r'\1_\2', col) for col in df.columns]
    df.columns = [re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', col) for col in df.columns]
    df.columns = [col.replace(" ", "_").lower() for col in df.columns]
    return df

def apply_mappings(df, value_mappings, lang):
    """
    Applies mappings to DataFrame columns based on language.
    """
    for column, mappings in value_mappings.items():
        if column in df.columns and lang in mappings:
            df[column] = df[column].map(mappings[lang]).fillna(df[column])
    return df

def handle_missing_values(df):
    """
    Handles missing values in a DataFrame.
    - Replaces invalid dates with NaT for date columns.
    - Converts empty strings to None.
    """
    for column in df.columns:
        if "date" in column.lower():
            df[column] = pd.to_datetime(df[column], errors="coerce")
        else:
            df[column] = df[column].replace("", None)
    return df

def enforce_column_types(df, column_types):
    """
    Enforces column data types based on provided column type rules.
    """
    for column, dtype in column_types.items():
        if column in df.columns:
            if dtype == "date":
                df[column] = pd.to_datetime(df[column], errors="coerce")
            elif dtype == "string":
                df[column] = df[column].astype(str)
    return df

def remove_duplicates(df):
    """
    Removes duplicate rows from the DataFrame.
    """
    return df.drop_duplicates()
