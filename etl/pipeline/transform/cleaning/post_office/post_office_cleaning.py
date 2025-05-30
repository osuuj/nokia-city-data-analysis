"""This script cleans post office data by removing invalid post codes, normalizing postal codes, modifying municipality codes, matching municipality codes with a reference CSV, and formatting city names."""

import logging
import os

import pandas as pd

from etl.pipeline.transform.cleaning.core.cleaning_utils import (
    normalize_postal_codes,
    remove_invalid_post_codes,
)
from etl.utils.file_io import save_to_csv_and_upload

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def match_municipality_codes(df: pd.DataFrame, resources_dir: str) -> pd.DataFrame:
    """Match municipality codes from the given CSV file to the DataFrame.

    Args:
        df (pd.DataFrame): Input DataFrame.
        resources_dir (str): Path to the resources directory.

    Returns:
        pd.DataFrame: DataFrame with matched municipality codes and updated city names.
    """
    municipality_codes = pd.read_csv(
        f"{resources_dir}/municipality_code.csv",
        sep=",",
        header=None,
        names=["code", "city"],
    )
    municipality_codes["code"] = pd.to_numeric(
        municipality_codes["code"], errors="coerce"
    )

    if "municipality" in df.columns:
        # Create a dictionary for quick lookup
        municipality_dict: dict = municipality_codes.set_index("code")["city"].to_dict()
        if isinstance(municipality_dict, dict):
            # Update the city column based on the municipality code
            df["city"] = df["municipality"].map(
                lambda x: municipality_dict.get(x, None)
            )
        else:
            logger.error("municipality_dict is not a dict. Skipping map operation.")
    else:
        logger.error("Column 'municipality' not found in DataFrame.")

    return df


def format_city_names(df: pd.DataFrame) -> pd.DataFrame:
    """Format city names to have the first letter capitalized and the rest in lowercase, and strip empty spaces.

    Args:
        df (pd.DataFrame): Input DataFrame.

    Returns:
        pd.DataFrame: DataFrame with formatted city names.
    """
    df["city"] = df["city"].astype(str).str.strip().str.title()
    return df


def clean_post_offices(
    df: pd.DataFrame,
    resources_dir: str,
    staging_dir: str,
    config: dict,
    entity_name: str = "post_offices",
) -> pd.DataFrame:
    """Clean post office data by running all cleaning functions and save to staging directory.

    Args:
        df (pd.DataFrame): Input DataFrame.
        resources_dir (str): Path to the resources directory.
        staging_dir (str): Path to the staging directory.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity (default: "post_offices").

    Returns:
        pd.DataFrame: Cleaned DataFrame.

    """
    df = remove_invalid_post_codes(df)
    df = normalize_postal_codes(df)
    df = format_city_names(df)
    df = match_municipality_codes(df, resources_dir)
    # Ensure the staging directory exists
    os.makedirs(staging_dir, exist_ok=True)
    # Save the cleaned DataFrame to a CSV file in the staging directory and upload to S3 if enabled
    output_path = f"{staging_dir}/staging_post_offices.csv"
    save_to_csv_and_upload(df, output_path, entity_name, config)

    return df
