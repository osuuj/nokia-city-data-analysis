"""This module provides functions for cleaning and standardizing company names."""

import re

import pandas as pd

from etl.utils.file_io import save_to_csv


def clean_company_name(name: str) -> str:
    """Cleans and standardizes company names by trimming, removing unnecessary special characters, and maintaining relevant formatting.

    Args:
        name (str): Raw company name.

    Returns:
        str: Cleaned company name.

    """
    if not isinstance(name, str) or pd.isna(name):
        return ""

    name = name.strip()  # Trim spaces
    name = re.sub(
        r"[^a-zA-Z0-9&\-. ]", "", name
    )  # Keep '&', '-', and '.' but remove other special characters
    name = re.sub(r"\s+", " ", name)  # Replace multiple spaces with a single space

    # Preserve uppercase formatting if the name is entirely in uppercase
    if not name.isupper():
        name = name.title()  # Standardize capitalization for non-uppercase names

    return name


def clean_names(df: pd.DataFrame, staging_dir: str, output_dir: str) -> None:
    """Cleans and standardizes company names in the DataFrame, and saves the cleaned data.

    Args:
        df (pd.DataFrame): The input DataFrame containing company names.
        staging_dir (str): Path to save staging files.
        output_dir (str): Path to save cleaned files.

    Returns:
        None
    """
    # Apply cleaning to company_name column
    df["company_name"] = df["company_name"].apply(clean_company_name)

    # Remove rows where registration_date is missing
    df_complete = df.dropna(subset=["registration_date"]).copy()
    df_missing = df[df["registration_date"].isna()]

    # Standardize `registrationDate` and `endDate` to YYYY-MM-DD format
    df_complete.loc[:, "registration_date"] = pd.to_datetime(
        df_complete["registration_date"], errors="coerce"
    ).dt.strftime("%Y-%m-%d")
    df_complete.loc[:, "end_date"] = pd.to_datetime(
        df_complete["end_date"], errors="coerce"
    ).dt.strftime("%Y-%m-%d")

    # Mark active companies where `endDate` is missing
    df_complete.loc[:, "active"] = df_complete["end_date"].isna()

    # Step 1: Sort data by `businessId`, `version`, and `registrationDate`
    df_complete = df_complete.sort_values(
        by=["business_id", "version", "registration_date"],
        ascending=[True, True, False],
    )

    # Step 2: Keep only the latest version
    # If multiple rows exist with `version = 1`, keep only the most recent `registrationDate`
    df_latest = df_complete[df_complete["version"] == 1].drop_duplicates(
        subset=["business_id"], keep="first"
    )

    # Step 3: Identify removed records (older versions)
    df_removed = df_complete[~df_complete.index.isin(df_latest.index)]

    # Save processed data
    save_to_csv(df_latest, f"{output_dir}/cleaned_names.csv")
    save_to_csv(df_removed, f"{output_dir}/staging_names_old.csv")
    save_to_csv(df_missing, f"{staging_dir}/staging_names_missing_registration.csv")

    print("Cleaning process completed.")
