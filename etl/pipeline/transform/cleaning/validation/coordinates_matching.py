"""Coordinates Matching.

Assigns latitude and longitude to matched addresses in different DataFrames using dictionary lookup.
"""

import logging
from typing import Dict, Optional, Tuple

import pandas as pd

logger = logging.getLogger(__name__)


def create_coordinates_dict(
    finland_df: pd.DataFrame, match_type: str
) -> Dict[Tuple[str, str, str], Tuple[float, float]]:
    """Creates a dictionary mapping (postal_code/municipality, street, house_number) to coordinates.

    Args:
        finland_df (pd.DataFrame): Reference DataFrame with correct coordinates.
        match_type (str): 'postal_code' or 'municipality'.

    Returns:
        Dict[Tuple[str, str, str], Tuple[float, float]]: Dictionary for quick lookups.
    """
    logger.info(
        f"Creating coordinates dictionary from finland_df using {match_type}..."
    )

    finland_df = finland_df.copy()

    # **Create dictionary for quick lookups**
    coordinates_dict = {}
    for _, row in finland_df.iterrows():
        key = (row[match_type], row["street"], row["house_number"])
        coordinates_dict[key] = (row["latitude_wgs84"], row["longitude_wgs84"])

    logger.info(
        f"Coordinates dictionary created with {len(coordinates_dict)} entries for {match_type}."
    )
    return coordinates_dict


def lookup_coordinates(
    row: pd.Series,
    coordinates_dict: Dict[Tuple[str, str, str], Tuple[float, float]],
    match_type: str,
) -> Tuple[Optional[float], Optional[float]]:
    """Looks up coordinates in the prebuilt dictionary.

    Args:
        row (pd.Series): A single row from a DataFrame.
        coordinates_dict (Dict[Tuple[str, str, str], Tuple[float, float]]): Prebuilt dictionary for quick lookups.
        match_type (str): Determines whether to use 'postal_code' or 'municipality' for lookup.

    Returns:
        Tuple[Optional[float], Optional[float]]: (latitude, longitude) if found, otherwise (None, None).
    """
    if match_type == "postal_code":
        key = (row["postal_code_match"], row["street_match"], row["house_number_match"])
    else:
        key = (
            row["municipality_match"],
            row["street_match"],
            row["house_number_match"],
        )
    return coordinates_dict.get(key, (None, None))


def assign_coordinates_from_dict(
    df: pd.DataFrame,
    coordinates_dict: Dict[Tuple[str, str, str], Tuple[float, float]],
    match_type: str,
) -> pd.DataFrame:
    """Assigns latitude and longitude to matched addresses using a prebuilt dictionary.

    Args:
        df (pd.DataFrame): DataFrame containing addresses with matched street, house number, and postal/municipality.
        coordinates_dict (Dict[Tuple[str, str, str], Tuple[float, float]]): Prebuilt dictionary for quick lookups.
        match_type (str): Determines which column to use for matching ('postal_code' or 'municipality').

    Returns:
        pd.DataFrame: Updated DataFrame with assigned coordinates.
    """
    logger.info(f"Assigning coordinates using dictionary lookup ({match_type})...")

    df = df.copy()

    # Copy values from street_match to street
    df["street"] = df["street_match"]
    # **Apply dictionary lookup**
    df[["latitude_wgs84", "longitude_wgs84"]] = df.apply(
        lambda row: lookup_coordinates(row, coordinates_dict, match_type),
        axis=1,
        result_type="expand",
    )

    # **Log missing coordinates**
    missing_coords = df["latitude_wgs84"].isna().sum()
    if missing_coords > 0:
        logger.warning(
            f"{missing_coords} addresses missing coordinates after dictionary lookup."
        )

    logger.info(
        f"Coordinate assignment completed using dictionary lookup ({match_type})."
    )
    return df
