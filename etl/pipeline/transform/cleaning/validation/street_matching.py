"""Street Matching Functions.

Contains functions for matching street names.
"""

import logging
from typing import Dict

import pandas as pd

logger = logging.getLogger(__name__)


def group_streets_by_column(finland_df: pd.DataFrame, column: str) -> Dict[str, list]:
    """Group street values by a specified column from Finland addresses."""
    return finland_df.groupby(column)["street"].apply(list).to_dict()


def find_matched_streets_by_postal(
    staging_df: pd.DataFrame, finland_df: pd.DataFrame
) -> pd.DataFrame:
    """Finds matches for street values in staging_df against finland_df.

    Args:
        staging_df (pd.DataFrame): DataFrame containing addresses to validate.
        finland_df (pd.DataFrame): Finland reference DataFrame.

    Returns:
        pd.DataFrame: Updated `staging_df` with 'street_match' and 'postal_code_match' columns.

    Raises:
        KeyError: If the required columns ('postal_code' or 'street') are missing in one of the DataFrames.
    """
    logger.info("Starting street matching process...")

    # Ensure necessary columns exist
    required_columns = ["postal_code", "street"]
    for col in required_columns:
        if col not in staging_df.columns or col not in finland_df.columns:
            logger.error(f"Missing column '{col}' in one of the DataFrames.")
            raise KeyError(f"Missing column '{col}' in one of the DataFrames.")

    # Create a dictionary of postal codes mapped to streets
    reference_dict = group_streets_by_column(finland_df, "postal_code")

    # Ensure 'postal_code' is a string to prevent mismatches
    staging_df["postal_code"] = staging_df["postal_code"].astype(str)

    # Create a boolean mask for valid matches
    mask = staging_df["postal_code"].isin(reference_dict) & staging_df.apply(
        lambda row: row["street"] in reference_dict.get(row["postal_code"], []), axis=1
    )

    # Assign matches
    staging_df.loc[mask, "street_match"] = staging_df.loc[mask, "street"]
    staging_df.loc[mask, "postal_code_match"] = staging_df.loc[mask, "postal_code"]

    # Logging results
    matched_count = mask.sum()
    total_streets = len(staging_df)
    logger.info(
        f"Street matching completed. Found {matched_count} matches out of {total_streets}."
    )

    return staging_df


def find_matched_streets_by_municipality(
    staging_df: pd.DataFrame, finland_df: pd.DataFrame
) -> pd.DataFrame:
    """Finds matches for street values in staging_df against finland_df using municipality.

    Args:
        staging_df (pd.DataFrame): DataFrame containing addresses to validate.
        finland_df (pd.DataFrame): Finland reference DataFrame.

    Returns:
        pd.DataFrame: Updated `staging_df` with 'street_match' and 'municipality_match' columns.

    Raises:
        KeyError: If the required columns ('municipality' or 'street') are missing in one of the DataFrames.
    """
    logger.info("Starting street matching by municipality...")

    # Ensure necessary columns exist
    required_columns = ["municipality", "street"]
    for col in required_columns:
        if col not in staging_df.columns or col not in finland_df.columns:
            logger.error(f"Missing column '{col}' in one of the DataFrames.")
            raise KeyError(f"Missing column '{col}' in one of the DataFrames.")

    # Create a dictionary of municipalities mapped to streets
    reference_dict = group_streets_by_column(finland_df, "municipality")

    # Ensure 'municipality' is a string to prevent mismatches
    staging_df["municipality"] = staging_df["municipality"].astype(str)

    # Create a boolean mask for valid matches
    mask = staging_df["municipality"].isin(reference_dict) & staging_df.apply(
        lambda row: row["street"] in reference_dict.get(row["municipality"], []), axis=1
    )

    # Assign matches
    staging_df.loc[mask, "street_match"] = staging_df.loc[mask, "street"]
    staging_df.loc[mask, "municipality_match"] = staging_df.loc[mask, "municipality"]

    # Logging results
    matched_count = mask.sum()
    total_streets = len(staging_df)
    logger.info(
        f"Street matching by municipality completed. Found {matched_count} matches out of {total_streets}."
    )

    return staging_df
