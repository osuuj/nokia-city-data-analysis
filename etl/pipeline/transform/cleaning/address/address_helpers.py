"""Contains functions for basic cleaning of the addresses.csv file, including normalizing column names, validating ranges, and standardizing data formats."""

import logging

import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def drop_unnecessary_columns(df: pd.DataFrame, columns_to_drop: list) -> pd.DataFrame:
    """Drop specified unnecessary columns from the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.
        columns_to_drop (list): List of columns to drop.

    Returns:
        pd.DataFrame: The DataFrame with specified columns removed.
    """
    return df.drop(
        columns=[col for col in columns_to_drop if col in df.columns], errors="ignore"
    )


def remove_unusable_rows(df: pd.DataFrame, required_columns: list) -> pd.DataFrame:
    """Remove rows where all specified key address components are missing.

    Args:
        df (pd.DataFrame): The input DataFrame.
        required_columns (list): List of key columns to check for missing values.

    Returns:
        pd.DataFrame: The DataFrame with rows removed where all key columns were missing.
    """
    if all(col in df.columns for col in required_columns):
        df = df.dropna(subset=required_columns, how="all")
    return df


def clean_building_number(df: pd.DataFrame) -> pd.DataFrame:
    """Remove rows with specific invalid 'business_id' values.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The cleaned DataFrame with specific rows removed.
    """
    if "business_id" not in df.columns:
        logger.warning("'business_id' column not found in DataFrame.")
        return df

    # Remove decimal points and trim spaces from building_number
    df["building_number"] = (
        df["building_number"].astype(str).str.strip().str.split(".").str[0]
    )
    return df


def clean_entrance_column(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize the 'entrance' column in the DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with the cleaned 'entrance' column.
    """
    if "entrance" not in df.columns:
        logger.warning("'entrance' column not found in DataFrame.")
        return df

    # Step 1: Remove invalid values
    invalid_values = [",", "2!", "lok."]
    df = df[~df["entrance"].isin(invalid_values)].copy()

    # Step 2: Standardize common patterns
    df["entrance"] = df["entrance"].replace(
        {
            "as": "as",
            "As": "as",
            "AS": "as",
            "AS.": "as",
            "as2": "as",
            "As.": "as",
            "bst": "bst",
            "BST": "bst",
            "Bst": "bst",
        }
    )

    # Step 3: Normalize case (capitalize all valid entries)
    df["entrance"] = df["entrance"].str.lower().astype(str).str.strip()
    return df


def filter_street_column(df: pd.DataFrame, filter_type: str) -> pd.DataFrame:
    """Filter rows based on the 'street' column.

    Args:
        df (pd.DataFrame): The input DataFrame.
        filter_type (str): Type of filtering ("missing", "special_characters").

    Returns:
        pd.DataFrame: The filtered DataFrame.

    Raises:
        ValueError: If an invalid filter_type is provided.
    """
    if "street" not in df.columns:
        logger.warning("'street' column not found in DataFrame.")
        return pd.DataFrame()

    if filter_type == "missing":
        filtered_df = df[df["street"].isna()]
    elif filter_type == "special_characters":
        filtered_df = df[
            df["street"].str.contains(r"[,./_&\-\d]", na=False)
            | df["street"].str.match(r"^A\s|^Aa\s", na=False)
        ]
    else:
        raise ValueError(
            "Invalid filter_type. Use 'missing', 'special_characters', or 'long_street'."
        )

    logger.info(f"Filtered {len(filtered_df)} rows using filter type '{filter_type}'.")
    return filtered_df


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


def add_columns_from_csv(df: pd.DataFrame, staging_dir: str) -> pd.DataFrame:
    """Add municipality and active columns to the DataFrame by matching business_id from another CSV file.

    Args:
        df (pd.DataFrame): The input DataFrame.
        staging_dir (str): Path to the CSV file containing business_id, municipality, and active columns.

    Returns:
        pd.DataFrame: The DataFrame with added columns.
    """
    output_path = f"{staging_dir}/staging_post_offices.csv"
    additional_data = pd.read_csv(output_path)
    df = df.merge(
        additional_data[
            ["business_id", "postal_code", "municipality", "city", "active"]
        ],
        on=["business_id", "postal_code"],
        how="left",
    )
    return df
