"""Cleaning Pipeline for Business Data.

This module contains standardized cleaning functions for multiple business-related datasets.
It ensures data integrity by formatting dates, standardizing text fields, and handling missing values.
"""

import pandas as pd
from etl.utils.file_io import save_to_csv_and_upload


def standardize_text_fields(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Standardizes text fields by stripping spaces and capitalizing words.

    Args:
        df (pd.DataFrame): DataFrame containing the data to be cleaned.
        columns (list): List of column names to be standardized.

    Returns:
        pd.DataFrame: DataFrame with standardized text fields.
    """
    for col in columns:
        df[col] = df[col].str.strip().str.title()
    return df


def format_dates(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Formats date columns to YYYY-MM-DD format.

    Args:
        df (pd.DataFrame): DataFrame containing the data to be cleaned.
        columns (list): List of column names to be formatted as dates.

    Returns:
        pd.DataFrame: DataFrame with formatted date columns.
    """
    for col in columns:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime("%Y-%m-%d")
    return df


def clean_dataset(
    df: pd.DataFrame, text_columns: list, date_columns: list, nullable_columns: list
) -> pd.DataFrame:
    """Generalized function to clean datasets by applying standard transformations.

    Args:
        df (pd.DataFrame): DataFrame containing the data to be cleaned.
        text_columns (list): List of text columns to be standardized.
        date_columns (list): List of date columns to be formatted.
        nullable_columns (list): List of columns to handle null values.

    Returns:
        pd.DataFrame: Cleaned DataFrame.
    """
    df = format_dates(df, date_columns)
    df = standardize_text_fields(df, text_columns)
    for col in nullable_columns:
        df[col] = df[col].where(pd.notnull(df[col]), None)
    return df


def clean_registered_entries(
    df: pd.DataFrame,
    output_dir: str,
    config: dict,
    entity_name: str = "registered_entries",
) -> None:
    """Cleans the registered_entries dataset.

    Args:
        df (pd.DataFrame): DataFrame containing the registered entries data.
        output_dir (str): Directory to save the cleaned data.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity (default: "registered_entries").
    """
    df = clean_dataset(
        df,
        ["registration_status_code", "register_name", "authority"],
        ["registration_date", "end_date"],
        ["end_date"],
    )
    save_to_csv_and_upload(
        df,
        f"{output_dir}/cleaned_registered_entries.csv",
        "cleaned_registered_entries",
        config,
    )


def clean_company_forms(
    df: pd.DataFrame, output_dir: str, config: dict, entity_name: str = "company_forms"
) -> None:
    """Cleans the company_forms dataset.

    Args:
        df (pd.DataFrame): DataFrame containing the company forms data.
        output_dir (str): Directory to save the cleaned data.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity (default: "company_forms").
    """
    df = clean_dataset(
        df, ["source"], ["registration_date", "end_date"], ["end_date", "business_form"]
    )
    save_to_csv_and_upload(
        df, f"{output_dir}/cleaned_company_forms.csv", "cleaned_company_forms", config
    )


def clean_company_situations(
    df: pd.DataFrame,
    output_dir: str,
    config: dict,
    entity_name: str = "company_situations",
) -> None:
    """Cleans the company_situations dataset.

    Args:
        df (pd.DataFrame): DataFrame containing the company situations data.
        output_dir (str): Directory to save the cleaned data.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity (default: "company_situations").
    """
    df = clean_dataset(df, ["situation_type", "source"], ["registration_date"], [])
    save_to_csv_and_upload(
        df,
        f"{output_dir}/cleaned_company_situations.csv",
        "cleaned_company_situations",
        config,
    )
