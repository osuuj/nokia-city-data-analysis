"""Contains functions for basic cleaning of the addresses.csv file, including normalizing column names, validating ranges, and standardizing data formats."""

import numpy as np
import pandas as pd
from numpy import int64


def drop_unnecessary_columns(df: pd.DataFrame, columns_to_drop: list) -> pd.DataFrame:
    """Drop specified columns from the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.
        columns_to_drop (list): List of columns to drop.

    Returns:
        pd.DataFrame: The DataFrame with specified columns removed.
    """
    df = df.drop(
        columns=[col for col in columns_to_drop if col in df.columns], errors="ignore"
    )
    return df


def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names to lowercase and replace spaces with underscores."""
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    return df


def rename_type_column(df: pd.DataFrame) -> pd.DataFrame:
    """Rename the 'type' column to 'address_type'."""
    if "type" in df.columns:
        df = df.rename(columns={"type": "address_type"})
    return df


def clean_street_column(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the 'street' column in the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with the cleaned 'street' column.
    """
    if "street" not in df.columns:
        print("Warning: 'street' column not found in DataFrame.")
        return df

    # Replace invalid placeholders with 'Unknown'
    invalid_values = [",", "-", "---", "----", "/"]
    df["street"] = df["street"].replace(invalid_values, "Unknown")

    # Preserve "c/o" parts by temporarily replacing them with a placeholder
    df["street"] = df["street"].str.replace(r"c/o", "COPLACEHOLDER", regex=True)

    # Remove leading/trailing slashes and underscores
    df["street"] = df["street"].str.strip(r"/_")

    # Replace underscores and slashes with spaces
    df["street"] = df["street"].str.replace(r"[_/]", " ", regex=True)

    # Restore "c/o" parts from the placeholder
    df["street"] = df["street"].str.replace("COPLACEHOLDER", "c/o", regex=True)

    # Normalize spaces and ensure capitalization
    df["street"] = (
        df["street"]
        .str.replace(
            r"\s+", " ", regex=True
        )  # Replace multiple spaces with a single space
        .str.title()  # Capitalize each word
        .str.strip()  # Remove leading/trailing whitespace
    )

    # Normalize 'Pl' or 'pl' to 'PL'
    df["street"] = df["street"].str.replace(r"\bPl\b", "PL", regex=True)

    # Handle specific patterns (e.g., combined data like "1.9.lähtien ...")
    df["street"] = df["street"].str.replace(r"^\d+\.\d+\.\S+\s+", "", regex=True)

    return df


def clean_building_number(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows with specific invalid 'business_id' values.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The cleaned DataFrame with specific rows removed.
    """
    if "business_id" not in df.columns:
        print("Warning: 'business_id' column not found in DataFrame.")
        return df

    # Remove rows with specific invalid business_id values
    invalid_values = ["3297568-9", "3297566-2"]
    df = df[~df["business_id"].astype(str).isin(invalid_values)]

    # Remove decimal points from building_number
    df["building_number"] = df["building_number"].astype(str).str.split(".").str[0]

    return df


def clean_entrance_column(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the 'entrance' column in the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with the cleaned 'entrance' column.
    """
    if "entrance" not in df.columns:
        print("Warning: 'entrance' column not found in DataFrame.")
        return df

    # Step 1: Remove invalid values
    invalid_values = [",", "2!", "lok."]
    df = df[~df["entrance"].isin(invalid_values)].copy()

    # Step 2: Standardize common patterns
    df.loc[:, "entrance"] = df["entrance"].replace(
        {
            "as": "as.",
            "As": "as.",
            "AS": "as.",
            "AS.": "as.",
            "as2": "as.",
            "As.": "as.",
            "bst": "bst.",
            "BST": "bst.",
            "Bst": "bst.",
        }
    )

    # Step 3: Normalize case (capitalize all valid entries)
    df.loc[:, "entrance"] = df["entrance"].str.capitalize()

    return df


def clean_apartment_id_suffix(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the 'apartment_id_suffix' column in the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with the cleaned 'apartment_id_suffix' column.
    """
    if "apartment_id_suffix" not in df.columns:
        print("Warning: 'apartment_id_suffix' column not found in DataFrame.")
        return df

    # Convert all values to uppercase
    df["apartment_id_suffix"] = df["apartment_id_suffix"].str.upper()

    return df


def remove_invalid_post_codes(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows where the 'post_code' column has the value 0.0.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with invalid rows removed.
    """
    if "post_code" in df.columns:
        df = df[df["post_code"] != 0.0]
    return df


def correct_column_types(df: pd.DataFrame) -> pd.DataFrame:
    """Correct column types for numeric and string columns.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with corrected column types.
    """
    if "post_code" in df.columns:
        df["post_code"] = (
            df["post_code"].astype(str).str.split(".").str[0]
        )  # Convert to string without decimals
    return df


def normalize_post_code(df: pd.DataFrame) -> pd.DataFrame:
    """Ensure all 'post_code' values are 5 digits long by prepending zeros where necessary.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with normalized 'post_code' values.
    """
    if "post_code" in df.columns:
        # Ensure all post_code values are 5 digits long by prepending zeros where necessary
        df["post_code"] = df["post_code"].apply(lambda x: f"{int(x):05d}")
    return df


def ensure_column_types(df: pd.DataFrame) -> pd.DataFrame:
    """Ensure the correct data types for each column in the addresses DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with corrected column types.
    """
    # Convert columns to the correct data types
    column_type_conversions = {
        "business_id": str,
        "type": str,
        "building_number": str,  # Handles null values as well
        "entrance": str,
        "apartment_number": str,  # Handles null values as well
        "apartment_id_suffix": str,
        "post_code": int64,  # Handles null values as well
        "co": str,
        "country": str,
        "free_address_line": str,
        "registration_date": "datetime64[ns]",  # Convert to datetime
    }

    # Apply conversions
    for column, dtype in column_type_conversions.items():
        if column in df.columns:
            try:
                if column == "post_code":
                    # Handle non-finite values in the post_code column
                    df[column] = pd.to_numeric(
                        df[column], errors="coerce"
                    )  # Convert to numeric, setting errors to NaN
                    df[column] = df[column].fillna(
                        -1
                    )  # Fill NaN values with a placeholder (e.g., -1)
                    df[column] = df[column].astype(np.int64)  # Convert to int64
                elif dtype == "Int64":
                    # Ensure integer type while handling NaNs
                    df[column] = pd.to_numeric(df[column], errors="coerce").astype(
                        dtype
                    )
                else:
                    df[column] = df[column].astype(dtype)
            except Exception as e:
                print(f"Warning: Could not convert {column} to {dtype}. Error: {e}")

    return df


def filter_street_column(
    df: pd.DataFrame, filter_type: str = "inspection"
) -> pd.DataFrame:
    """Filter rows based on the 'street' column.

    Args:
        df (pd.DataFrame): The input DataFrame.
        filter_type (str): Type of filtering ("inspection" or "special_characters").

    Returns:
        pd.DataFrame: The filtered DataFrame.

    Raises:
        ValueError: If an invalid filter_type is provided.
    """
    if "street" not in df.columns:
        print("Warning: 'street' column not found in DataFrame.")
        return pd.DataFrame()

    # Convert string "NaN" to actual NaN values
    df["street"] = df["street"].replace(["", " ", "NaN", None], pd.NA).astype("string")

    if filter_type == "inspection":
        # Filter rows where 'street' is NaN or starts with invalid characters
        filtered_df = df[
            df["street"].isna() | df["street"].str.match(r"^[,\-/\d]", na=False)
        ]
    elif filter_type == "special_characters":
        # Filter rows where 'street' contains special characters or starts with "A " or "Aa "
        filtered_df = df[
            df["street"].str.contains(r"[,&/\.]", na=False)
            | df["street"].str.match(r"^A\s|^Aa\s", na=False)
        ]
    elif filter_type == "with_comma":
        # Filter rows where 'street' contains a comma
        filtered_df = df[df["street"].str.contains(",", na=False)]
    elif filter_type == "without_comma":
        # Filter rows where 'street' does not contain a comma
        filtered_df = df[~df["street"].str.contains(",", na=False)]
    elif filter_type == "with_number":
        # Filter rows where 'street' contains a number
        filtered_df = df[df["street"].str.contains(r"\d", na=False)]
    else:
        raise ValueError(
            "Invalid filter_type. Use 'inspection' or 'special_characters'."
        )

    return filtered_df


def filter_special_characters(df: pd.DataFrame) -> pd.DataFrame:
    """Filter rows where the 'street' column contains special characters.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The filtered DataFrame.
    """
    return filter_street_column(df, filter_type="special_characters")


def basic_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    """Perform basic cleaning tasks on the addresses DataFrame.

    Args:
        df (pd.DataFrame): The raw addresses DataFrame.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
    df = normalize_column_names(df)
    df = drop_unnecessary_columns(
        df, ["post_office_box", "source"]
    )  # Remove 'post_office_box' and 'source'
    df = rename_type_column(df)  # Rename 'type' to 'address_type'
    df = ensure_column_types(df)  # Correct column types
    df = normalize_post_code(df)  # Ensure post codes are 5 digits
    df = clean_street_column(df)  # Clean 'street' column
    df = clean_building_number(df)  # Clean 'building_number' column
    df = clean_entrance_column(df)  # Clean 'entrance' column
    df = clean_apartment_id_suffix(df)  # Clean 'apartment_id_suffix' column

    return df
