import os
from typing import Optional

import pandas as pd

from etl.utils.cleaning_utils import (
    clean_numeric_column,
    handle_missing_values,
    remove_duplicates,
    transform_column_names,
)


def clean_dataset(
    df: pd.DataFrame, entity_name: str, specific_columns: Optional[list[str]] = None
) -> pd.DataFrame:
    """Cleans a dataset by applying general and entity-specific transformations.

    Args:
        df (pd.DataFrame): The DataFrame to clean.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (list, optional): Columns requiring specific cleaning (e.g., numeric columns).

    Returns:
        pd.DataFrame: The cleaned DataFrame.

    Raises:
        ValueError: If there is an error during dataset cleaning, such as invalid content in columns.
    """
    try:
        # Transform column names to snake_case
        df = transform_column_names(df)

        # Entity-specific cleaning
        if entity_name == "addresses" and specific_columns:
            for column in specific_columns:
                if column in df.columns:
                    df[column] = df[column].apply(clean_numeric_column)

        # General cleaning steps
        df = handle_missing_values(df)
        df = remove_duplicates(df)

    except Exception as e:
        raise ValueError(
            f"Error during cleaning dataset for entity '{entity_name}': {e}"
        )

    return df


def clean_entity_files(
    extracted_path: str,
    cleaned_path: str,
    entity_name: str,
    specific_columns: Optional[list] = None,
) -> None:
    """Cleans all CSV files for a specific entity.

    Args:
        extracted_path (str): Path to the extracted data.
        cleaned_path (str): Path to save the cleaned data.
        entity_name (str): The name of the entity being cleaned.
        specific_columns (list, optional): Columns requiring specific cleaning (e.g., numeric columns).

    Raises:
        ValueError: If there is an error cleaning a specific file.
        RuntimeError: If there is an error during the overall cleaning process.
    """
    input_dir = os.path.join(extracted_path, entity_name)
    output_dir = os.path.join(cleaned_path, entity_name)
    os.makedirs(output_dir, exist_ok=True)

    try:
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
                    raise ValueError(f"Failed to clean file '{file_name}': {e}")

    except Exception as e:
        raise RuntimeError(
            f"Error while cleaning files for entity '{entity_name}': {e}"
        )
