import re

import pandas as pd


def clean_without_comma(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and modify the 'street' column text values.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with the cleaned 'street' column.
    """
    if "street" not in df.columns:
        print("Warning: 'street' column not found in DataFrame.")
        return df

    # Create a copy of the DataFrame to avoid SettingWithCopyWarning
    df = df.copy()
    # Capitalize and replace 'pl' with 'PL'
    # Capitalize the first letter of each word
    df["street"] = df["street"].str.title()
    df["street"] = df["street"].str.replace("Pl", "PL")
    # Define replacements
    replacements = {
        r"^Wtc\.": "",
        r"Entie Valimokuja": "",
        r"^([A-Z])\.(?!\s)": r"\1. ",
        r"\bPl\b": "PL",
        r"\bStie\b": "St.",
        r"Skata-Mjödträsk V\.": "Skata-Mjödträskvägen",
        r"\bKatu\b": "katu",
        r"\bTie\b": "tie",
    }

    # Apply replacements
    for pattern, replacement in replacements.items():
        df["street"] = df["street"].str.replace(pattern, replacement, regex=True)

    # Move "Muijalan Teoll.Alue" to 'co' column
    df.loc[df["street"].str.contains(r"Muijalan Teoll\.Alue", regex=True), "co"] = (
        "Muijalan Teoll.Alue"
    )
    df["street"] = df["street"].str.replace(r"Muijalan Teoll\.Alue", "", regex=True)

    # Strip leading/trailing whitespace
    df["street"] = df["street"].str.strip()

    return df


# Define the function to extract building number, entrance, and apartment number
def extract_parts(row):
    street = row["street"]
    building_number = None
    entrance = None
    apartment_number = None

    # Extract building number
    match = re.search(r"\d+(?:-\d+)?", street)
    if match:
        building_number = match.group(0)
        street = street.replace(building_number, "", 1).strip()

    # Extract entrance and apartment number
    match = re.search(r"([A-Z])?\s*[Aa]s\.\s*(\d+)", street)
    if match:
        entrance = match.group(1) if match.group(1) else "as."
        apartment_number = match.group(2)
        street = street.replace(match.group(0), "", 1).strip()
    else:
        match = re.search(r"\b([A-Z])\b", street)
        if match:
            entrance = match.group(1)
            street = street.replace(entrance, "", 1).strip()

    # Remove letter "B" from the end of the text
    street = re.sub(r"B$", "", street).strip()

    # Remove numbers from the end of the text
    street = re.sub(r"\d+$", "", street).strip()

    street = re.sub(r"\bleksanterinkatu\s+A\b", "Aleksanterinkatu", street)

    return street, building_number, entrance, apartment_number


# Function to process the DataFrame
def process_street_column(df: pd.DataFrame) -> pd.DataFrame:
    """Process the 'street' column to extract building number, entrance, and apartment number.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: The DataFrame with processed 'street' column and new columns for building number, entrance, and apartment number.
    """
    df[["street", "building_number", "entrance", "apartment_number"]] = df.apply(
        lambda row: pd.Series(extract_parts(row)), axis=1
    )
    return df
