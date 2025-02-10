"""Entity-Specific Cleaning Functions.

This module contains functions for entity-specific transformations,
such as removing irrelevant columns based on CSV type.
"""

import logging

import pandas as pd

from etl.config.config_loader import CONFIG  # Load dynamic entity configurations
from etl.utils.file_io import read_csv

logger = logging.getLogger(__name__)


def drop_irrelevant_columns(df: pd.DataFrame, entity_name: str) -> pd.DataFrame:
    """Drop specified columns from the DataFrame based on entity type.

    Args:
        df (pd.DataFrame): The input DataFrame.
        entity_name (str): The name of the entity.

    Returns:
        pd.DataFrame: The DataFrame with irrelevant columns removed.
    """
    # Load column configurations dynamically from entities.yml
    entity_config = next(
        (e for e in CONFIG["entities"] if e["name"] == entity_name), None
    )

    if not entity_config:
        logger.warning(
            f"No configuration found for entity '{entity_name}'. Skipping irrelevant column removal."
        )
        return df  # Return original DataFrame

    columns_to_drop = entity_config.get("specific_columns", [])  # Load from config
    existing_columns = [col for col in columns_to_drop if col in df.columns]

    if existing_columns:
        df = df.drop(columns=existing_columns)
        logger.info(f"Dropped columns for {entity_name}: {existing_columns}")
    else:
        logger.info(f"No irrelevant columns found for {entity_name}.")

    return df


def clean_post_offices(df: pd.DataFrame, resources_dir: str) -> pd.DataFrame:
    """Clean and standardize the post_offices dataset.

    Args:
        df (pd.DataFrame): The DataFrame containing post office data.
        resources_dir (str): Path to the resources directory containing `municipality_code.csv`.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
    # Remove duplicate rows
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)
    logger.info(f"Removed {before - after} duplicate rows.")

    # Fix postcode formatting (ensure int64 and pad to 5 digits)
    df["postCode"] = df["postCode"].astype(str).str.zfill(5)

    # Convert city names to title case
    df["city"] = df["city"].str.title()

    # Load municipality mapping
    municipality_map = read_csv(f"{resources_dir}/municipality_code.csv")
    municipality_dict = dict(
        zip(municipality_map["municipalityCode"], municipality_map["city"])
    )

    # Replace "OSOITE ON TUNTEMATON" with mapped city values
    unknown_addresses = df["city"].str.contains(
        "OSOITE ON TUNTEMATON", case=False, na=False
    )
    df.loc[unknown_addresses, "city"] = df.loc[
        unknown_addresses, "municipalityCode"
    ].map(municipality_dict)

    return df


def filter_latest_company_names(df: pd.DataFrame) -> pd.DataFrame:
    """Keep only the latest version of company names based on registration date.

    Args:
        df (pd.DataFrame): The DataFrame containing company name history.

    Returns:
        pd.DataFrame: A DataFrame with only the latest company names.
    """
    df = df.sort_values(
        by=["business_id", "version", "registration_date"],
        ascending=[True, False, False],
    )
    df = df.drop_duplicates(subset=["business_id"], keep="first")
    return df
