import os
from pathlib import Path
import pandas as pd
import re
import numpy as np
from etl.config.config_loader import load_schemas

# Utility Functions
def transform_column_names(df):
    """
    Transforms a column name into snake_case.
    """
    df.columns = [re.sub(r'([a-z])([A-Z])', r'\1_\2', col) for col in df.columns]
    df.columns = [re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', col) for col in df.columns]
    df.columns = [col.replace(" ", "_").lower() for col in df.columns]
    return df

def apply_mappings(df, schema):
    mappings = schema.get("mappings", {})
    for column, mapping in mappings.items():
        if column in df.columns:
            df[column] = df[column].map(mapping).fillna(df[column])
    return df

def handle_missing_values(df):
    """
    Handle missing values in a DataFrame:
    - For date columns: Replace empty strings or invalid dates with NaT, then convert NaT to None.
    - For non-date columns: Replace empty strings with None.
    """
    for column in df.columns:
        if "date" in column.lower():  # Detect date columns by name
            # Convert empty strings or invalid dates to NaT
            df[column] = pd.to_datetime(df[column].replace("", None), errors="coerce")
        else:
            # Replace empty strings with None for non-date columns
            df[column] = df[column].replace("", None)

    # Ensure NaT (Not a Time) values are converted to None for PostgreSQL
    for column in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[column]):
            df[column] = df[column].where(df[column].notnull(), None)

    return df

def enforce_types(df, schema):
    for column, rules in schema["columns"].items():
        if column in df.columns:
            dtype = rules["type"]
            if dtype == "date":
                df[column] = pd.to_datetime(df[column], errors="coerce")
            elif dtype == "string":
                df[column] = df[column].astype(str)
    return df

def remove_duplicates(df):
    return df.drop_duplicates()

def clean_dataset(input_file, output_file, schema):
    # Infer column data types from the schema
    dtype_map = {col: "string" for col, rules in schema["columns"].items() if rules["type"] == "string"}
    
    # Read the CSV with explicit data types
    df = pd.read_csv(input_file, dtype=dtype_map)
    
    # Apply transformations
    df = handle_missing_values(df)
    df = enforce_types(df, schema)
    df = apply_mappings(df, schema)
    df = remove_duplicates(df)
    df = transform_column_names(df)
    
    # Save the cleaned data
    df.to_csv(output_file, index=False)

def process_all_files(extract_data_path, processed_data_path, entity_name, schema_file):
    input_path = Path(extract_data_path) / entity_name
    output_path = Path(processed_data_path) / entity_name
    output_path.mkdir(parents=True, exist_ok=True)
    schema = load_schemas(schema_file)
    
    for file in input_path.glob("*.csv"):
        output_file = output_path / file.name
        clean_dataset(file, output_file, schema)
        print(f"Processed: {file} -> {output_file}")

