"""This module provides helper functions for cleaning and processing staging address data.

Functions include cleaning and filtering rows, extracting building numbers and entrances, and moving extracted values to their respective columns.

"""

import re
from typing import Tuple

import pandas as pd

from etl.pipeline.transform.cleaning.address.address_helpers import filter_street_column


def filter_clean_and_save_missing_street_addresses(
    df: pd.DataFrame,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Filter, clean, and save missing street addresses to a staging file.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with missing street addresses removed.
    """
    missing_street = filter_street_column(df, filter_type="missing")

    if not missing_street.empty:
        df = df.drop(missing_street.index)
        missing_street = (
            missing_street.copy()
        )  # Ensure independent copy before modifying

        if "active" in missing_street.columns:
            missing_street["active"] = (
                missing_street["active"].astype("boolean").fillna(False)
            )

        # Normalize 'free_address_line' column
        if "free_address_line" in missing_street.columns:
            missing_street["free_address_line"] = missing_street[
                "free_address_line"
            ].fillna("")
            missing_street["free_address_line"] = (
                missing_street["free_address_line"]
                .str.replace("_", " ")
                .str.replace("/", ",")
                .str.strip()
            )

        # Remove rows where 'registration_date' is NaN
        missing_street = missing_street.dropna(subset=["registration_date"])

        # Remove unnecessary columns
        columns_to_remove = [
            "street",
            "building_number",
            "entrance",
            "apartment_number",
        ]
        missing_street = missing_street.drop(columns=columns_to_remove, errors="ignore")

        # Convert 'registration_date' to standardized format
        missing_street["registration_date"] = pd.to_datetime(
            missing_street["registration_date"], errors="coerce"
        )
        missing_street["registration_date"] = missing_street[
            "registration_date"
        ].dt.strftime("%Y-%m-%d")
        missing_street["registration_date"] = missing_street[
            "registration_date"
        ].fillna("")

        # Convert 'postal_code' and 'municipality' to string, preserving leading zeros
        if "postal_code" in missing_street.columns:
            missing_street["postal_code"] = (
                missing_street["postal_code"]
                .replace("", pd.NA)
                .astype("Int64")
                .astype(str)
                .str.zfill(5)
            )
        if "municipality" in missing_street.columns:
            missing_street["municipality"] = (
                missing_street["municipality"]
                .replace("", pd.NA)
                .astype("Int64")
                .astype(str)
            )

    return df, missing_street


def filter_and_save_special_chars_street_addresses(df: pd.DataFrame) -> pd.DataFrame:
    """Filter and save special characters street addresses.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with special characters street addresses processed.
    """
    special_chars_street = filter_street_column(df, filter_type="special_characters")
    if not special_chars_street.empty:
        special_chars_street = move_numbers_to_columns(special_chars_street)
        df = df.drop(special_chars_street.index)
        df = pd.concat([df, special_chars_street])

    return df


def extract_number_and_entrance(row: pd.Series) -> pd.Series:
    """Extracts building number and entrance from the street string.

    Args:
        row (pd.Series): A row of the DataFrame.

    Returns:
        pd.Series: Updated street, building_number, and entrance values.
    """
    street = row["street"]
    building_number = row.get("building_number", "")
    entrance = row.get("entrance", "")

    # Extract building number and entrance
    match = re.search(r"(\d+)(?:\s*([A-Z]))?", street)
    if match:
        building_number = match.group(1)  # Capture the number
        street = street.replace(
            match.group(0), "", 1
        ).strip()  # Remove the matched part

        # Capture the entrance if present
        if match.group(2):
            entrance = match.group(2)

    return pd.Series(
        {
            "street": street.strip(),
            "building_number": building_number,
            "entrance": entrance,
        }
    )


def move_numbers_to_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Moves extracted building numbers and entrances to their respective columns.

    Args:
        df (pd.DataFrame): Input DataFrame with 'street' column.

    Returns:
        pd.DataFrame: DataFrame with updated 'street', 'building_number', and 'entrance' columns.
    """
    extracted = df.apply(extract_number_and_entrance, axis=1)
    df.loc[:, ["street", "building_number", "entrance"]] = extracted
    return df


def standardize_and_clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize and clean the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The standardized and cleaned DataFrame.
    """
    df["apartment_number"] = pd.to_numeric(
        df["apartment_number"], errors="coerce"
    ).astype("Int64")
    df["registration_date"] = pd.to_datetime(df["registration_date"], errors="coerce")
    df["registration_date"] = df["registration_date"].dt.strftime("%Y-%m-%d")
    df["registration_date"] = df["registration_date"].fillna("")
    df["street"] = df["street"].str.title().str.strip()
    df["city"] = df["city"].str.title().str.strip()
    df["country"] = df["country"].str.upper().str.strip()
    df["city"] = df["city"].fillna("Unknown")
    df[["entrance", "co"]] = df[["entrance", "co"]].replace("", None)
    df.drop_duplicates(
        subset=[
            "business_id",
            "street",
            "building_number",
            "postal_code",
            "city",
            "address_type",
        ],
        keep="first",
        inplace=True,
    )
    df["city"] = df["city"].fillna("Unknown")

    return df


def process_unmatched_addresses(df: pd.DataFrame) -> pd.DataFrame:
    """Process unmatched addresses.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The processed DataFrame.
    """
    df = df.dropna(subset=["street"])
    df = df.drop(columns=["latitude_wgs84", "longitude_wgs84"], errors="ignore")
    df["registration_date"] = pd.to_datetime(df["registration_date"], errors="coerce")
    df["registration_date"] = df["registration_date"].dt.strftime("%Y-%m-%d")
    df["registration_date"] = df["registration_date"].fillna("")
    df["postal_code"] = df["postal_code"].astype(str)
    df["municipality"] = df["municipality"].astype(str)
    return df
