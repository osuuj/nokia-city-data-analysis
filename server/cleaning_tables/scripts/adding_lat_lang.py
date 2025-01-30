"""This module contains functions to find and add latitude and longitude coordinates to addresses by matching them with a resource DataFrame."""

import glob

import numpy as np
import pandas as pd
from numpy import int64


def find_coordinates(row, df_resources):
    """Find coordinates for a given row by matching it with the resource DataFrame.

    Args:
        row (pd.Series): A row from the cleaned addresses DataFrame.
        df_resources (pd.DataFrame): The resource DataFrame containing address coordinates.

    Returns:
        tuple: A tuple containing the latitude and longitude if a match is found, otherwise (None, None).
    """
    postal_code = f"{row['postal_code']:05d}"  # Ensure postal_code is 5 digits
    street = row["street"].strip()

    try:
        filtered_df = df_resources.loc[(postal_code, street)]
        print(f"Filtered DataFrame for postal_code={postal_code} and street={street}:")
        print(filtered_df)
    except KeyError:
        print(f"No match found for postal_code={postal_code} and street={street}")
        return None, None

    if not filtered_df.empty:
        # Extract numeric and possible letter part from house_number
        house_num = str(row["building_number"]).strip()
        num_part = "".join(filter(str.isdigit, house_num))
        letter_part = "".join(filter(str.isalpha, house_num))

        print(
            f"House number: {house_num}, Numeric part: {num_part}, Letter part: {letter_part}"
        )

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
                print(f"Match found: {match.iloc[0]}")
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
            "post_code": int64,
        },
    )

    # Rename 'post_code' to 'postal_code' to match resource files
    df_cleaned.rename(columns={"post_code": "postal_code"}, inplace=True)

    # Debug print to check columns
    print("Columns in df_cleaned:", df_cleaned.columns)

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

    # Debug print to check columns
    print("Columns in df_resources before setting index:", df_resources.columns)

    # Create an index on 'postal_code' and 'street' for faster lookups
    df_resources.set_index(["postal_code", "street"], inplace=True)

    # Sort the DataFrame by the index levels to improve performance
    df_resources.sort_index(inplace=True)

    # Debug print to check columns after setting index
    print("Index names in df_resources after setting index:", df_resources.index.names)

    # Apply the function to update latitude and longitude
    df_cleaned[["latitude", "longitude"]] = df_cleaned.apply(
        lambda row: apply_find_coordinates(row, df_resources),
        axis=1,
        result_type="expand",
    )

    # Save the updated dataframe
    df_cleaned_file = output_dir / f"{cleaned_addresses_path.name}"
    df_cleaned.to_csv(df_cleaned_file, index=True)


def apply_find_coordinates(row, df_resources):
    """Wrapper function to apply find_coordinates.

    Args:
        row (pd.Series): A row from the cleaned addresses DataFrame.
        df_resources (pd.DataFrame): The resource DataFrame containing address coordinates.

    Returns:
        tuple: A tuple containing the latitude and longitude if a match is found, otherwise (None, None).
    """
    return find_coordinates(row, df_resources)
