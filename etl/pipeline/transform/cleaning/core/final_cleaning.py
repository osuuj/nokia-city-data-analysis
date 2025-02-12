"""Cleaning Pipeline for Business Data.

This module contains standardized cleaning functions for multiple business-related datasets.
It ensures data integrity by formatting dates, standardizing text fields, and handling missing values.

"""

import pandas as pd

from etl.utils.file_io import save_to_csv


def standardize_text_fields(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Standardizes text fields by stripping spaces and capitalizing words."""
    for col in columns:
        df[col] = df[col].str.strip().str.title()
    return df


def format_dates(df: pd.DataFrame, columns: list) -> pd.DataFrame:
    """Formats date columns to YYYY-MM-DD format."""
    for col in columns:
        df[col] = pd.to_datetime(df[col], errors="coerce").dt.strftime("%Y-%m-%d")
    return df


def clean_dataset(
    df: pd.DataFrame, text_columns: list, date_columns: list, nullable_columns: list
) -> pd.DataFrame:
    """Generalized function to clean datasets by applying standard transformations."""
    df = format_dates(df, date_columns)
    df = standardize_text_fields(df, text_columns)
    for col in nullable_columns:
        df[col] = df[col].where(pd.notnull(df[col]), None)
    return df


def clean_registered_entries(df: pd.DataFrame, output_dir: str) -> None:
    """Cleans the registered_entries dataset."""
    df = clean_dataset(
        df,
        ["registration_status_code", "register_name", "authority"],
        ["registration_date", "end_date"],
        ["end_date"],
    )
    save_to_csv(df, f"{output_dir}/cleaned_registered_entries.csv")


def clean_main_business_lines(df: pd.DataFrame, output_dir: str) -> None:
    """Cleans the main_business_lines dataset."""
    df = clean_dataset(
        df, ["industry_description", "source"], ["registration_date"], ["industry"]
    )
    save_to_csv(df, f"{output_dir}/cleaned_main_business_lines.csv")


def clean_company_forms(df: pd.DataFrame, output_dir: str) -> None:
    """Cleans the company_forms dataset."""
    df = clean_dataset(
        df, ["source"], ["registration_date", "end_date"], ["end_date", "business_form"]
    )
    save_to_csv(df, f"{output_dir}/cleaned_company_forms.csv")


def clean_company_situations(df: pd.DataFrame, output_dir: str) -> None:
    """Cleans the company_situations dataset."""
    df = clean_dataset(df, ["type", "source"], ["registration_date"], [])
    save_to_csv(df, f"{output_dir}/cleaned_company_situations.csv")
