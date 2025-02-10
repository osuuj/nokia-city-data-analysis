"""Best Match Finder.

Contains functions for fuzzy matching of street names, postal codes, municipalities, and house numbers.
"""

import logging
from typing import Dict, Tuple

import pandas as pd
from rapidfuzz import fuzz, process

from etl.pipeline.transform.cleaning.validation.house_number_matching import (
    get_house_number_match_fuzzy,
)
from etl.pipeline.transform.cleaning.validation.street_matching import (
    group_streets_by_column,
)

logger = logging.getLogger(__name__)


def apply_fuzzy_street_matching(
    df: pd.DataFrame,
    finland_df: pd.DataFrame,
    house_number_dict: Dict[Tuple[str, str], set],
    group_by_column: str,
    threshold: int = 80,
) -> pd.DataFrame:
    """Applies fuzzy matching to find the best street matches for unmatched addresses.

    Args:
        df (pd.DataFrame): DataFrame containing addresses with missing `street_match`.
        finland_df (pd.DataFrame): Reference DataFrame containing valid street names.
        house_number_dict (Dict[Tuple[str, str], set]): Dictionary mapping (street, postal_code/municipality) to valid house numbers.
        group_by_column (str): Column to use for matching (either "postal_code" or "municipality").
        threshold (int): Minimum match score to accept.

    Returns:
        pd.DataFrame: Updated DataFrame with fuzzy-matched street values.

    Raises:
        KeyError: If the required columns ('street' or `group_by_column`) are missing in the DataFrame.
    """
    logger.info(
        f"Applying fuzzy matching for unmatched street values using '{group_by_column}'..."
    )

    # Ensure necessary columns exist
    if "street" not in df.columns or group_by_column not in df.columns:
        logger.error(f"Missing 'street' or '{group_by_column}' column in DataFrame.")
        raise KeyError(f"Missing 'street' or '{group_by_column}' column in DataFrame.")

    total_house_numbers = len(df)
    # Create a dictionary of postal codes mapped to streets
    reference_dict = group_streets_by_column(finland_df, group_by_column)
    # Copy DataFrame to prevent modification warnings
    df = df.copy()
    df[
        [
            "street_match",
            "postal_code_match",
            "municipality_match",
            "house_number_match",
        ]
    ] = None

    for index, row in df.iterrows():
        street_name = row["street"]
        key_value = row[group_by_column]
        if pd.isna(street_name) or pd.isna(key_value):
            continue
        if key_value in reference_dict:
            matches = process.extract(
                street_name,
                reference_dict[key_value],
                scorer=fuzz.token_set_ratio,
                limit=5,
            )
            best_match, best_score = max(
                matches, key=lambda x: x[1], default=(None, 0)
            )[:2]

            if best_score >= threshold:
                df.at[index, "street_match"] = best_match
                df.at[index, f"{group_by_column}_match"] = key_value
                if best_match is not None:
                    df.at[index, "house_number_match"] = get_house_number_match_fuzzy(
                        best_match, key_value, row["house_number"], house_number_dict
                    )

    logger.info(
        f"Fuzzy matching completed. Found {df['street_match'].notna().sum()} fuzzy matches out of {total_house_numbers}."
    )

    return df
