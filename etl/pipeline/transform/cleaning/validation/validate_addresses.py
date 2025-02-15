"""Validate Addresses.

Main function to validate street names and house numbers in a staging DataFrame
against a reference DataFrame of Finland addresses.
"""

import logging
from typing import Tuple

import pandas as pd

from etl.pipeline.transform.cleaning.validation.best_match_finder import (
    apply_fuzzy_street_matching,
)
from etl.pipeline.transform.cleaning.validation.coordinates_matching import (
    assign_coordinates_from_dict,
    create_coordinates_dict,
)
from etl.pipeline.transform.cleaning.validation.street_matching import (
    find_matched_streets_by_municipality,
    find_matched_streets_by_postal,
)

from .house_number_matching import (
    clean_house_number,
    create_house_number_dict,
    match_house_numbers,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def read_and_extract_columns(
    staging_df: pd.DataFrame, finland_df: pd.DataFrame
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Reads CSV files and extracts required columns, ensuring data consistency.

    Args:
        staging_df (pd.DataFrame): DataFrame containing the staging data with addresses to validate.
        finland_df (pd.DataFrame): DataFrame containing the reference data with correct addresses.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: A tuple containing the normalized staging DataFrame and the normalized Finland reference DataFrame.
    """
    # Normalize data
    staging_df["house_number"] = staging_df.apply(
        lambda row: f"{str(row['building_number']).strip() if pd.notna(row['building_number']) else ''}"
        f"{str(row['entrance']).strip() if pd.notna(row['entrance']) else ''}",
        axis=1,
    )
    staging_df["street"] = staging_df["street"].astype(str).str.lower().str.strip()
    staging_df["postal_code"] = (
        staging_df["postal_code"].astype(str).str.strip().str.zfill(5)
    )
    staging_df["municipality"] = (
        staging_df["municipality"]
        .astype(str)
        .str.strip()
        .str.replace(r"\.0$", "", regex=True)
    )
    staging_df["house_number"] = staging_df["house_number"].apply(clean_house_number)

    # Normalize Finland reference data
    finland_df["street"] = finland_df["street"].astype(str).str.lower().str.strip()
    finland_df["postal_code"] = (
        finland_df["postal_code"].astype(str).str.strip().str.zfill(5)
    )
    finland_df["municipality"] = (
        finland_df["municipality"]
        .astype(str)
        .str.strip()
        .str.replace(r"\.0$", "", regex=True)
    )
    finland_df["house_number"] = (
        finland_df["house_number"]
        .astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "", regex=True)
    )

    # Remove duplicates
    staging_df.drop_duplicates(inplace=True)
    finland_df.drop_duplicates(inplace=True)

    # Sort data for consistency
    staging_df.sort_values(by=["postal_code", "street", "municipality"], inplace=True)
    finland_df.sort_values(by=["postal_code", "street", "municipality"], inplace=True)

    return staging_df, finland_df


def validate_street_names(
    staging_df: pd.DataFrame, finland_df: pd.DataFrame, output_path: str
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Orchestrates the street name validation process.

    Args:
        staging_df (pd.DataFrame): DataFrame with addresses to validate.
        finland_df (pd.DataFrame): Reference DataFrame with correct addresses.
        output_path (str): Path to save the validated addresses.

    Returns:
        pd.DataFrame: Cleaned staging_df (with matched addresses)

    """
    logger.info("Starting street validation process.")

    # Read and preprocess staging & reference data
    staging_df, finland_df = read_and_extract_columns(staging_df, finland_df)

    house_number_post_dict = create_house_number_dict(
        finland_df, ("street", "postal_code")
    )
    house_number_municipality_dict = create_house_number_dict(
        finland_df, ("street", "municipality")
    )
    coordinates_dict_postal = create_coordinates_dict(finland_df, "postal_code")
    coordinates_dict_municipality = create_coordinates_dict(finland_df, "municipality")

    # Match streets by postal code
    street_postal_df = find_matched_streets_by_postal(staging_df, finland_df)
    street_postal_df = match_house_numbers(
        street_postal_df, house_number_post_dict, "postal_code"
    )
    street_municipality_df = street_postal_df[
        street_postal_df["street_match"].isna()
    ].copy()
    street_postal_df = street_postal_df.dropna(subset=["street_match"])
    street_postal_df = assign_coordinates_from_dict(
        street_postal_df, coordinates_dict_postal, "postal_code"
    )

    # Match streets by municipality for unmatched rows
    street_municipality_df = find_matched_streets_by_municipality(
        street_municipality_df, finland_df
    )
    street_municipality_df = match_house_numbers(
        street_municipality_df, house_number_municipality_dict, "municipality"
    )
    best_municipality_df = street_municipality_df[
        street_municipality_df["street_match"].isna()
    ].copy()
    street_municipality_df = street_municipality_df.dropna(subset=["street_match"])
    street_municipality_df = assign_coordinates_from_dict(
        street_municipality_df, coordinates_dict_municipality, "municipality"
    )

    best_municipality_df = apply_fuzzy_street_matching(
        best_municipality_df, finland_df, house_number_municipality_dict, "municipality"
    )
    best_postal_df = best_municipality_df[
        best_municipality_df["street_match"].isna()
    ].copy()
    best_municipality_df = best_municipality_df.dropna(subset=["street_match"])
    best_municipality_df = assign_coordinates_from_dict(
        best_municipality_df, coordinates_dict_municipality, "municipality"
    )

    best_postal_df = apply_fuzzy_street_matching(
        best_postal_df, finland_df, house_number_post_dict, "postal_code"
    )
    no_coordinates = best_postal_df[best_postal_df["street_match"].isna()].copy()
    best_postal_df = best_postal_df.dropna(subset=["street_match"])
    best_postal_df = assign_coordinates_from_dict(
        best_postal_df, coordinates_dict_postal, "postal_code"
    )

    # Combine DataFrames with coordinates
    address_with_coordinates_df = pd.concat(
        [
            street_postal_df.dropna(subset=["latitude_wgs84", "longitude_wgs84"]),
            street_municipality_df.dropna(subset=["latitude_wgs84", "longitude_wgs84"]),
            best_municipality_df.dropna(subset=["latitude_wgs84", "longitude_wgs84"]),
            best_postal_df.dropna(subset=["latitude_wgs84", "longitude_wgs84"]),
        ]
    )

    # Combine DataFrames without coordinates
    unmatched_df = pd.concat(
        [
            street_postal_df[
                street_postal_df["latitude_wgs84"].isna()
                | street_postal_df["longitude_wgs84"].isna()
            ],
            street_municipality_df[
                street_municipality_df["latitude_wgs84"].isna()
                | street_municipality_df["longitude_wgs84"].isna()
            ],
            best_municipality_df[
                best_municipality_df["latitude_wgs84"].isna()
                | best_municipality_df["longitude_wgs84"].isna()
            ],
            best_postal_df[
                best_postal_df["latitude_wgs84"].isna()
                | best_postal_df["longitude_wgs84"].isna()
            ],
            no_coordinates,
        ]
    )

    # **Remove unnecessary columns**
    address_with_coordinates_df.drop(
        columns=[
            "house_number",
            "street_match",
            "postal_code_match",
            "house_number_match",
            "municipality_match",
        ],
        errors="ignore",
        inplace=True,
    )
    # **Remove unnecessary columns**
    unmatched_df.drop(
        columns=[
            "house_number",
            "street_match",
            "postal_code_match",
            "house_number_match",
            "municipality_match",
        ],
        errors="ignore",
        inplace=True,
    )

    logger.info("Street name validation completed.")

    return address_with_coordinates_df, unmatched_df
