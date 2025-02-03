"""This module contains functions to find and add latitude and longitude coordinates to addresses by matching them with a resource DataFrame.

Functions:
    find_coordinates: Find coordinates for a given row by matching it with the resource DataFrame.
    find_coordinates_values: Processes cleaned_addresses.csv by adding latitude and longitude columns, sorting the street column, and matching addresses with resource files.
    apply_find_coordinates: Wrapper function to apply find_coordinates.
"""

import glob

import numpy as np
import pandas as pd
from fuzzywuzzy import process
from numpy import int64


def normalize_street_name(street):
    """Normalize street names by converting to lowercase and stripping whitespace.

    Args:
        street (str): The street name to normalize.

    Returns:
        str: The normalized street name.
    """
    return street.strip().lower()


def find_coordinates(row, df_resources):
    """Find coordinates for a given row by matching it with the resource DataFrame.

    Args:
        row (pd.Series): A row from the cleaned addresses DataFrame.
        df_resources (pd.DataFrame): The resource DataFrame containing address coordinates.

    Returns:
        tuple: A tuple containing the latitude and longitude if a match is found, otherwise (None, None).
    """
    postal_code = f"{row['postal_code']:05d}"  # Ensure postal_code is 5 digits
    street = normalize_street_name(row["street"])

    try:
        filtered_df = df_resources.loc[postal_code]
    except KeyError:
        return None, None

    if not filtered_df.empty:
        # Use fuzzy matching to find the closest street name
        street_names = filtered_df.index.get_level_values("street").unique()
        best_match, score = process.extractOne(street, street_names)
        if score < 80:  # Adjust the threshold as needed
            return None, None

        filtered_df = filtered_df.loc[(postal_code, best_match)]

        # Extract numeric and possible letter part from house_number
        house_num = str(row["building_number"]).strip()
        num_part = "".join(filter(str.isdigit, house_num))
        letter_part = "".join(filter(str.isalpha, house_num))

        match = filtered_df[
            filtered_df["house_number"]
            .astype(str)
            .str.extract(r"(\d+)([a-zA-Z]*)", expand=False)[0]
            .str.lower()
            == num_part.lower()
        ]
        if not match.empty:
            if letter_part:
                match = match[
                    match["house_number"].astype(str).str.endswith(letter_part)
                ]

            if not match.empty:
                return match.iloc[0]["latitude_wgs84"], match.iloc[0]["longitude_wgs84"]

    return None, None


def find_coordinates_values(cleaned_addresses_path, resource_files_pattern, output_dir):
    """Processes cleaned_addresses.csv by adding latitude and longitude columns, sorting the street column, and matching addresses with resource files.

    Args:
        cleaned_addresses_path (str): Path to the cleaned addresses CSV file.
        resource_files_pattern (str): Glob pattern to match resource files.
        output_dir (str): Directory to save the updated CSV file.
    """
    # Load the cleaned addresses file
    df_cleaned = pd.read_csv(
        cleaned_addresses_path,
        dtype={
            "street": str,
            "building_number": str,
            "entrance": str,
            "postal_code": int64,
        },
    )

    # Rename 'post_code' to 'postal_code' to match resource files
    df_cleaned.rename(columns={"post_code": "postal_code"}, inplace=True)

    # Add latitude and longitude columns
    df_cleaned["latitude"] = np.nan
    df_cleaned["longitude"] = np.nan

    # Ensure correct data type
    df_cleaned = df_cleaned.astype({"latitude": "float64", "longitude": "float64"})

    # Sort by street column
    df_cleaned = df_cleaned.sort_values(by=["street"], ascending=True)

    # Load all resource files
    resource_files = glob.glob(resource_files_pattern)
    df_resources = pd.concat(
        [
            pd.read_csv(
                file, dtype={"street": str, "house_number": str, "postal_code": str}
            )
            for file in resource_files
        ]
    )

    # Normalize street names in the resource DataFrame
    df_resources["street"] = df_resources["street"].apply(normalize_street_name)

    # Create an index on 'postal_code' and 'street' for faster lookups
    df_resources.set_index(["postal_code", "street"], inplace=True)

    # Sort the DataFrame by the index levels to improve performance
    df_resources.sort_index(inplace=True)

    # Apply the function to update latitude and longitude
    df_cleaned[["latitude", "longitude"]] = df_cleaned.apply(
        lambda row: apply_find_coordinates(row, df_resources),
        axis=1,
        result_type="expand",
    )

    # Save the updated dataframe
    df_cleaned_file = output_dir / f"{cleaned_addresses_path.name}"
    df_cleaned.to_csv(df_cleaned_file, index=False)


def apply_find_coordinates(row, df_resources):
    """Wrapper function to apply find_coordinates.

    Args:
        row (pd.Series): A row from the cleaned addresses DataFrame.
        df_resources (pd.DataFrame): The resource DataFrame containing address coordinates.

    Returns:
        tuple: A tuple containing the latitude and longitude if a match is found, otherwise (None, None).
    """
    return find_coordinates(row, df_resources)
