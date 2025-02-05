"""This script validates street names in a staging DataFrame against a reference DataFrame of Finland addresses."""

import logging
from glob import glob
from typing import Dict, Tuple

import pandas as pd
from rapidfuzz import fuzz, process

from etl.utils.file_io import read_and_concatenate_csv_files, save_to_csv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def read_and_extract_columns(
    staging_path: str, finland_df: pd.DataFrame
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Read CSV files and extract required columns.

    Args:
        staging_path (str): Path to the staging addresses CSV file.
        finland_df (pd.DataFrame): Dataframe to match Finland addresses CSV files.

    Returns:
        Tuple[pd.DataFrame, pd.DataFrame]: DataFrames with extracted columns.

    """
    # Read CSV files
    staging_df = pd.read_csv(
        staging_path, usecols=["business_id", "street", "postal_code", "municipality"]
    )

    # Normalize columns
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

    # Remove duplicates
    staging_df = staging_df.drop_duplicates()
    finland_df = finland_df.drop_duplicates()

    # Sort DataFrames
    staging_df = staging_df.sort_values(by=["postal_code", "street", "municipality"])
    finland_df = finland_df.sort_values(by=["postal_code", "street", "municipality"])

    return staging_df, finland_df


def group_streets_by_column(finland_df: pd.DataFrame, column: str) -> Dict[str, list]:
    """Group street values by a specified column from Finland addresses.

    Args:
        finland_df (pd.DataFrame): DataFrame with Finland addresses.
        column (str): Column name to group by.

    Returns:
        Dict[str, list]: Dictionary with column values as keys and lists of street names as values.

    """
    grouped_dict = finland_df.groupby(column)["street"].apply(list).to_dict()
    return grouped_dict


def is_mismatched(row, reference_dict):
    """Check if a row is mismatched based on the reference dictionary.

    Args:
        row (pd.Series): Row to check.
        reference_dict (dict): Reference dictionary.

    Returns:
        bool: True if mismatched, False otherwise.

    """
    postal_code = row["postal_code"]
    street = row["street"]
    return (
        postal_code not in reference_dict or street not in reference_dict[postal_code]
    )


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
    mismatched_df = staging_df[
        staging_df.apply(is_mismatched, axis=1, reference_dict=reference_dict)
    ].copy()
    mismatched_df["best_match"] = None
    mismatched_df["best_postal_code"] = None
    mismatched_df["best_municipality"] = None

    return mismatched_df


def search_best_matches_by_column(
    mismatched_df: pd.DataFrame,
    reference_dict: Dict[str, list],
    column: str,
    threshold: int,
) -> pd.DataFrame:
    """Search for the best matches for mismatched street values by a specified column.

    Args:
        mismatched_df (pd.DataFrame): DataFrame with mismatched street values.
        reference_dict (Dict[str, list]): Dictionary with column values as keys and lists of street names as values.
        column (str): Column name to group by.
        threshold (int): Minimum match score for a street name to be considered valid.

    Returns:
        pd.DataFrame: DataFrame with best matches and column values.
    """
    for index, row in mismatched_df.iterrows():
        street_name = row["street"]
        column_value = row[column]

        if column_value in reference_dict:
            matches = process.extract(
                street_name,
                reference_dict[column_value],
                scorer=fuzz.token_set_ratio,
                limit=5,
            )
            best_match, best_score = max(
                matches, key=lambda x: x[1], default=(None, 0)
            )[:2]

            if best_score >= threshold:
                mismatched_df.at[index, "best_match"] = best_match
                mismatched_df.at[index, f"best_{column}"] = column_value

    return mismatched_df


def validate_street_names():
    staging_path = "etl/data/processed_data/staging/staging_addresses.csv"
    finland_path_pattern = "etl/data/resources/*_addresses_2024-11-14.csv"
    output_path = (
        "etl/data/processed_data/staging/incorrect_streets_with_best_match.csv"
    )
    threshold = 80  # Lowered threshold for testing

    logger.info("Starting the validation of street names.")

    # Step 1: Read and concatenate Finland addresses CSV files
    finland_file_paths = glob(finland_path_pattern)
    finland_df = read_and_concatenate_csv_files(finland_file_paths)
    logger.info("Step 1: Read and concatenated Finland addresses CSV files.")

    # Step 2: Read CSV files and extract required columns
    staging_df, finland_df = read_and_extract_columns(staging_path, finland_df)
    logger.info("Step 2: Read CSV files and extracted required columns.")

    # Step 3: Group street values by postal code
    reference_dict_postal = group_streets_by_column(finland_df, "postal_code")
    logger.info("Step 3: Grouped street values by postal code.")

    # Step 4: Find mismatched street values by postal code
    mismatched_df_postal = find_mismatched_streets(staging_df, reference_dict_postal)
    logger.info("Step 4: Found mismatched street values by postal code.")
    save_to_csv(
        mismatched_df_postal,
        "etl/data/processed_data/staging/mismatched_streets_postal.csv",
    )
    logger.info("Saved mismatched street values by postal code to CSV.")

    # Step 5: Search for best matches by postal code
    result_df_postal = search_best_matches_by_column(
        mismatched_df_postal, reference_dict_postal, "postal_code", threshold
    )
    logger.info("Step 5: Searched for best matches by postal code.")
    save_to_csv(
        result_df_postal, "etl/data/processed_data/staging/best_matches_postal.csv"
    )
    logger.info("Saved best matches by postal code to CSV.")

    # Step 6: Filter rows that still have missing street values
    still_mismatched_df = result_df_postal[result_df_postal["best_match"].isnull()]
    logger.info("Step 6: Filtered rows that still have missing street values.")

    # Step 7: Group street values by municipality
    reference_dict_municipality = group_streets_by_column(finland_df, "municipality")
    logger.info("Step 7: Grouped street values by municipality.")

    # Step 8: Search for best matches by municipality for still mismatched rows
    result_df_municipality = search_best_matches_by_column(
        still_mismatched_df, reference_dict_municipality, "municipality", threshold
    )
    logger.info(
        "Step 8: Searched for best matches by municipality for still mismatched rows."
    )
    save_to_csv(
        result_df_municipality,
        "etl/data/processed_data/staging/best_matches_municipality.csv",
    )
    logger.info("Saved best matches by municipality to CSV.")

    # Step 9: Update the original result_df_postal with the new matches found by municipality
    result_df_postal.update(result_df_municipality)
    logger.info(
        "Step 9: Updated the original result_df_postal with the new matches found by municipality."
    )

    # Step 10: Save the final results to CSV
    save_to_csv(result_df_postal, output_path)
    logger.info("Step 10: Saved the final results to CSV.")

    logger.info("Validation of street names completed.")


if __name__ == "__main__":
    validate_street_names()
