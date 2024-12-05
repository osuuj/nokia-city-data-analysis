import os
import pandas as pd
from etl.utils.cleaning_utils import (
    clean_numeric_column,
    transform_column_names,
    handle_missing_values,
    remove_duplicates,
)

def clean_dataset(df, entity_name, specific_columns=None):
    """
    Cleans a dataset by applying general and entity-specific transformations.

    Args:
        df (pd.DataFrame): The DataFrame to clean.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (list): Columns requiring specific cleaning (e.g., numeric columns).

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
    # Transform column names
    df = transform_column_names(df)

    # Entity-specific cleaning
    if entity_name == "addresses" and specific_columns:
        for column in specific_columns:
            if column in df.columns:
                df[column] = df[column].apply(clean_numeric_column)

    # General cleaning steps
    df = handle_missing_values(df)
    df = remove_duplicates(df)

    return df

def clean_entity_files(extracted_path, cleaned_path, entity_name, specific_columns=None):
    """
    Cleans all CSV files for a specific entity.

    Args:
        extracted_path (str): Path to the extracted data.
        cleaned_path (str): Path to save the cleaned data.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (list): Columns requiring specific cleaning (e.g., numeric columns).
    """
    input_dir = os.path.join(extracted_path, entity_name)
    output_dir = os.path.join(cleaned_path, entity_name)
    os.makedirs(output_dir, exist_ok=True)

    for file_name in os.listdir(input_dir):
        if file_name.endswith(".csv"):
            input_file = os.path.join(input_dir, file_name)
            output_file = os.path.join(output_dir, file_name)

            try:
                df = pd.read_csv(input_file)
                cleaned_df = clean_dataset(df, entity_name, specific_columns)
                cleaned_df.to_csv(output_file, index=False)
                print(f"Cleaned file saved: {output_file}")
            except Exception as e:
                print(f"Error cleaning file {input_file}: {e}")
