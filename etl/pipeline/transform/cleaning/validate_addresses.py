import logging
from typing import Tuple

import pandas as pd
from rapidfuzz import fuzz, process

from etl.utils.file_io import save_to_csv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def read_and_extract_columns(
    staging_path: str, finland_path: str
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Read CSV files and extract required columns.

    Args:
        staging_path (str): Path to the staging addresses CSV file.
        finland_path (str): Path to the Finland addresses CSV file.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: DataFrames with extracted columns.
    """
    # Read CSV files
    staging_df = pd.read_csv(
        staging_path, usecols=["business_id", "street", "postal_code"]
    )
    finland_df = pd.read_csv(finland_path, usecols=["postal_code", "street"])

    # Normalize columns
    staging_df["street"] = staging_df["street"].astype(str).str.lower().str.strip()
    staging_df["postal_code"] = (
        staging_df["postal_code"].astype(str).str.strip().str.zfill(5)
    )
    finland_df["street"] = finland_df["street"].astype(str).str.lower().str.strip()
    finland_df["postal_code"] = (
        finland_df["postal_code"].astype(str).str.strip().str.zfill(5)
    )

    # Remove duplicates
    staging_df = staging_df.drop_duplicates()
    finland_df = finland_df.drop_duplicates()

    # Sort DataFrames
    staging_df = staging_df.sort_values(by=["postal_code", "street"])
    finland_df = finland_df.sort_values(by=["postal_code", "street"])

    return staging_df, finland_df


def group_streets_by_postal_code(finland_df: pd.DataFrame) -> dict:
    """Group street values by postal code from Finland addresses.

    Args:
        finland_df (pd.DataFrame): DataFrame with Finland addresses.

    Returns:
        dict: Dictionary with postal codes as keys and lists of street names as values.
    """
    # Create reference dictionary { postal_code: [streets] }
    reference_dict = finland_df.groupby("postal_code")["street"].apply(list).to_dict()
    return reference_dict


def find_mismatched_streets(
    staging_df: pd.DataFrame, reference_dict: dict
) -> pd.DataFrame:
    """Find mismatched street values from staging addresses in Finland addresses.

    Args:
        staging_df (pd.DataFrame): DataFrame with staging addresses.
        reference_dict (dict): Dictionary with postal codes as keys and sets of street names as values.

    Returns:
        pd.DataFrame: DataFrame with mismatched street values.
    """

    def is_mismatched(row):
        postal_code = row["postal_code"]
        street = row["street"]
        return (
            postal_code not in reference_dict
            or street not in reference_dict[postal_code]
        )

    mismatched_df = staging_df[staging_df.apply(is_mismatched, axis=1)].copy()
    mismatched_df["best_match"] = None
    mismatched_df["best_postal"] = None

    return mismatched_df


def search_best_matches(
    mismatched_df: pd.DataFrame, reference_dict: dict, threshold: int
) -> pd.DataFrame:
    """Search for the best matches for mismatched street values.

    Args:
        mismatched_df (pd.DataFrame): DataFrame with mismatched street values.
        reference_dict (dict): Dictionary with postal codes as keys and lists of street names as values.
        threshold (int): Minimum match score for a street name to be considered valid.

    Returns:
        pd.DataFrame: DataFrame with best matches and postal codes.
    """
    for index, row in mismatched_df.iterrows():
        street_name = row["street"]
        postal_code = row["postal_code"]

        best_match = None
        best_score = 0

        if postal_code in reference_dict:
            matches = process.extract(
                street_name,
                reference_dict[postal_code],
                scorer=fuzz.token_sort_ratio,
                limit=5,
            )
            for match, score, _ in matches:
                if score > best_score:
                    best_match = match
                    best_score = score

        if best_score >= threshold:
            mismatched_df.at[index, "best_match"] = best_match
            mismatched_df.at[index, "best_postal"] = postal_code

    return mismatched_df


def validate_street_names():
    staging_path = "etl/data/processed_data/staging/staging_addresses.csv"
    finland_path = "etl/data/resources/Finland_addresses_2024-11-14.csv"
    output_path = (
        "etl/data/processed_data/staging/incorrect_streets_with_best_match.csv"
    )
    threshold = 80

    # Step 1: Read CSV files and extract required columns
    staging_df, finland_df = read_and_extract_columns(staging_path, finland_path)

    # Step 2: Group street values by postal code
    reference_dict = group_streets_by_postal_code(finland_df)

    # Step 3: Find mismatched street values
    mismatched_df = find_mismatched_streets(staging_df, reference_dict)

    # Step 4: Search for best matches
    result_df = search_best_matches(mismatched_df, reference_dict, threshold)

    # Step 5: Save results to CSV
    save_to_csv(result_df, output_path)
