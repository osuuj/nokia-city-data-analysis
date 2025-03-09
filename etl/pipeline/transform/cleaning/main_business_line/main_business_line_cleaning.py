"""This module provides functionality to clean the main business lines dataset."""

import pandas as pd

from etl.pipeline.transform.cleaning.core.final_cleaning import clean_dataset
from etl.pipeline.transform.cleaning.main_business_line.industry_mapping import (
    process_main_business_lines,
)
from etl.utils.file_io import save_to_csv


def clean_main_business_lines(df: pd.DataFrame, output_dir: str) -> None:
    """Cleans the main_business_lines dataset.

    This function processes the main_business_lines DataFrame to fill missing
    industry letters, performs final cleaning, and saves the cleaned data to
    the specified output directory.

    Args:
        df (pd.DataFrame): DataFrame containing the main business lines data.
        output_dir (str): Directory to save the cleaned data.
    """
    # Process the main_business_lines DataFrame
    df = process_main_business_lines(df)

    # Clean the dataset
    df = clean_dataset(
        df, ["industry_description", "source"], ["registration_date"], ["industry"]
    )

    # Save the cleaned DataFrame
    save_to_csv(df, f"{output_dir}/cleaned_main_business_lines.csv")
