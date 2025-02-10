"""House Number Matching Functions.

Contains functions for matching house numbers.
"""

import logging
from typing import Dict, Optional, Tuple

import pandas as pd
from rapidfuzz import fuzz, process

logger = logging.getLogger(__name__)


def clean_house_number(value: Optional[str]) -> str:
    """Cleans and normalizes house number values.

    Args:
        value (Optional[str]): The house number value to clean.

    Returns:
        str: The cleaned house number value.
    """
    if pd.isna(value):
        return ""

    # Convert to string, lowercase, and strip leading/trailing spaces
    cleaned_value = str(value).lower().strip()

    # Remove specific substrings
    substrings_to_remove = ["nan", " ", "as.", "lh.", "lt."]
    for substring in substrings_to_remove:
        cleaned_value = cleaned_value.replace(substring, "")

    return cleaned_value


def create_house_number_dict(
    finland_df: pd.DataFrame, group_by: Tuple[str, str]
) -> Dict[Tuple[str, str], set]:
    """Creates a dictionary mapping (street, postal_code) to a set of house numbers.

    Args:
        finland_df (pd.DataFrame): Finland reference addresses.
        group_by (Tuple[str, str]): Columns to group by (e.g., ("street", "postal_code")).

    Returns:
        Dict[Tuple[str, str], set]: Dictionary with (street, postal_code) as keys and sets of house numbers as values.

    Raises:
        KeyError: If the required columns are missing in the DataFrame.
    """
    if not all(col in finland_df.columns for col in group_by):
        raise KeyError(f"Missing required columns in DataFrame: {group_by}")

    return (
        finland_df.groupby(list(group_by))["house_number"]
        .apply(lambda x: set(x.dropna()))  # Ensure no NaN values
        .to_dict()
    )


def find_best_house_number(
    key: Tuple[str, str],
    house_number: str,
    house_number_dict: Dict[Tuple[str, str], set],
    threshold: int = 65,
) -> str:
    """Finds the best matching house number using rapidfuzz if an exact match is not found.

    Args:
        key: The key to look up in the house number dictionary.
        house_number: The house number to match.
        house_number_dict: Dictionary mapping (street, postal_code) to house numbers.
        threshold: Minimum match score to accept.

    Returns:
        The best matching house number.
    """
    if key in house_number_dict:
        possible_matches = house_number_dict[key]
        # First, check for an exact match
        if house_number in possible_matches:
            return house_number
        # If no exact match, apply fuzzy matching
        best_match = process.extractOne(
            house_number, possible_matches, scorer=fuzz.partial_ratio
        )
        if best_match and best_match[1] >= threshold:  # Apply fuzzy threshold
            return best_match[0]
    return ""


def get_house_number_match(
    row: pd.Series,
    house_number_dict: Dict[Tuple[str, str], set],
    key_column: str,
    threshold: int = 65,
) -> str:
    """Helper function to get the best house number match for a row.

    Args:
        row: The row of the DataFrame.
        house_number_dict: Dictionary mapping (street, postal_code) to house numbers.
        key_column: Column name used for matching (e.g., 'postal_code' or 'municipality').
        threshold: Minimum match score to accept.

    Returns:
        The best matching house number.
    """
    key = (row["street_match"], row[key_column])
    if pd.notna(row["street_match"]) and pd.notna(row[key_column]):
        return find_best_house_number(
            key, row["house_number"], house_number_dict, threshold
        )
    return ""


def get_house_number_match_fuzzy(
    street_match: str,
    key_value: str,
    house_number: str,
    house_number_dict: Dict[Tuple[str, str], set],
    threshold: int = 65,
) -> str:
    """Helper function to get the best house number match for a row in fuzzy matching.

    Args:
        street_match: The matched street name.
        key_value: The postal code or municipality value.
        house_number: The house number to match.
        house_number_dict: Dictionary mapping (street, postal_code/municipality) to valid house numbers.
        threshold: Minimum match score to accept.

    Returns:
        The best matching house number.
    """
    key = (street_match, key_value)
    if pd.notna(street_match) and pd.notna(key_value):
        return find_best_house_number(key, house_number, house_number_dict, threshold)
    return ""


def match_house_numbers(
    unmatched_df: pd.DataFrame,
    house_number_dict: Dict[Tuple[str, str], set],
    key_column: str,
    threshold: int = 65,
) -> pd.DataFrame:
    """Matches house numbers in staging data to the best reference match.

    Args:
        unmatched_df: DataFrame containing addresses.
        house_number_dict: Dictionary mapping (street, key_column) to house numbers.
        key_column: Column name used for matching (e.g., 'postal_code' or 'municipality').
        threshold: Minimum match score to accept.

    Returns:
        pd.DataFrame: Updated DataFrame with best house number matches.

    Raises:
        KeyError: If the required columns ('house_number' or `key_column`) are missing in the DataFrame.
    """
    logger.info(f"Matching house numbers using {key_column}...")

    if (
        "house_number" not in unmatched_df.columns
        or key_column not in unmatched_df.columns
    ):
        logger.error(
            f"Missing required columns: 'house_number' or '{key_column}' in DataFrame."
        )
        raise KeyError(f"Missing required columns: 'house_number' or '{key_column}'.")

    # Initialize column for storing matches
    unmatched_df["house_number_match"] = None

    for index, row in unmatched_df.iterrows():
        if (
            pd.isna(row["house_number"])
            or pd.isna(row["street_match"])
            or pd.isna(row[key_column])
        ):
            continue  # Skip rows with missing values

        unmatched_df.at[index, "house_number_match"] = get_house_number_match(
            row, house_number_dict, key_column, threshold
        )

    matched_count = unmatched_df["house_number_match"].notna().sum()
    total_count = len(unmatched_df)
    logger.info(
        f"House number matching completed. Found {matched_count} matches out of {total_count}."
    )

    return unmatched_df
