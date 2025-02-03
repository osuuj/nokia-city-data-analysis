"""Base Cleaning Functions.

This module contains core functions used for standardizing and preprocessing
all extracted CSV files before deeper entity-specific transformations.
"""

import logging
import re
from typing import Optional, Tuple

import pandas as pd

logger = logging.getLogger(__name__)

# Define how missing values should be handled per column
MISSING_VALUE_RULES = {
    "company_name": "clean_company_name",  # Placeholder for name standardization
    "post_code": "validate_postcode",  # Validate postcodes, move invalid to staging
    "website": "clean_website",  # Standardize and clean website URLs
    "registration_date": "move_to_staging",  # Move missing registration dates to staging
    "business_form": "move_to_staging",  # Move missing business forms to staging
    "street": "move_to_staging",  # Move missing addresses for later enrichment
}


def standardize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize column names to snake_case without excessive underscores.

    Args:
        df (pd.DataFrame): The DataFrame whose column names will be standardized.

    Returns:
        pd.DataFrame: A new DataFrame with column names in snake_case.
    """
    original_columns = df.columns.tolist()

    df.columns = [
        re.sub(
            r"[^a-zA-Z0-9_]",
            "",
            re.sub(r"__+", "_", re.sub(r"([a-z])([A-Z])", r"\1_\2", col)),
        )
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]

    changed_columns = {
        orig: new for orig, new in zip(original_columns, df.columns) if orig != new
    }

    if changed_columns:
        logger.info(f"Standardized column names: {changed_columns}")
    else:
        logger.info("Column names were already standardized.")

    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from a DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: Deduplicated DataFrame.
    """
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)

    if before > after:
        logger.info(f"Removed {before - after} duplicate rows.")
    else:
        logger.info("No duplicate rows found.")

    return df


def clean_website(url: str) -> Optional[str]:
    """Standardize website URLs.

    Args:
        url (str): The website URL to clean.

    Returns:
        str: The standardized website URL or None if invalid.
    """
    if pd.isna(url) or url.strip().lower() == "unknown":
        return None  # Treat "Unknown" as missing
    url = url.strip().lower()
    if not url.startswith("www.") and "." in url:
        url = "www." + url  # Ensure consistent formatting
    return url


def handle_missing_values(
    df: pd.DataFrame, entity_name: str, resources_dir: str
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Handle missing values based on predefined rules and perform necessary transformations.

    Args:
        df (pd.DataFrame): The DataFrame to process.
        entity_name (str): The entity name to determine specific handling rules.
        resources_dir (str): Path to resources directory for additional reference files.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: (Cleaned DataFrame, Staging DataFrame)
    """
    staging_df = pd.DataFrame()

    # Ensure 'active' column exists for consistency across tables
    if "active" not in df.columns and "end_date" in df.columns:
        df["active"] = df["end_date"].isna()
        logger.info("Added 'active' column based on 'end_date'.")

    for column, action in MISSING_VALUE_RULES.items():
        if column in df.columns:
            if action == "Unknown":
                df[column] = df[column].fillna("Unknown")
            elif action == "clean_website":
                df[column] = df[column].apply(clean_website)
            elif action == "move_to_staging":
                missing_rows = df[df[column].isna()]
                if not missing_rows.empty:
                    staging_df = pd.concat(
                        [staging_df, missing_rows], ignore_index=True
                    )  # Collect for staging
                    df = df.dropna(subset=[column])  # Remove from main dataset
                    logger.info(
                        f"Moved {len(missing_rows)} records to staging due to missing {column}"
                    )

    return df, staging_df
