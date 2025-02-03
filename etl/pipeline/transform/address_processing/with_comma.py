"""This module contains functions to process and clean address data by extracting and moving non-address parts from the 'street' column to the 'co' column, handling special cases, and normalizing the data."""

import re

import pandas as pd

# Updated list of address keywords (expandable based on new patterns)
address_keywords = [
    "katu",
    "tie",
    "polku",
    "kuja",
    "ranta",
    "mäki",
    "lahti",
    "puisto",
    "talo",
    "vägen",
    "gatan",
    "kaari",
    "pl",
    "puistikko",
    "lövö",
    "kaunissaari",
    "massby",
    "teknologiakylä",
    "oulun kauppatori",
    "bamböle",
    "brännskär",
    "klingendahlc",
    "hietalahden halli",
    "sorronrinne",
    "piha",
    "tori",
    "järsö",
    "aukio",
    "rinne",
    "firdonkatu",
    "eteläranta",
    "farmvägen",
    "fiskstranden",
    "huikku",
    "bulevardi",
    "hoikankangas",
    "kaasutehtaankatu",
    "wallininkuja",
    "aleksandrankuja",
    "veturitie",
    "vilhelmintie",
    "maariankatu",
    "hennalankatu",
    "ruusutie",
    "rantakatu",
    "verkstadsvägen",
    "torikatu",
    "metsänneidonkuja",
    "nivankylä",
    "venuksentie",
    "venuksenkuja",
    "pikkukatu",
    "pihlajatie",
    "tervasharjunkatu",
    "lamaslotvägen",
    "lakkapolku",
    "teerentie",
    "tallberginkatu",
    "södergatan",
    "stormälö",
    "vehkalantie",
    "tammelan metsätie",
    "bertel jungin aukio",
    "tomtensväg",
    "piispansilta",
    "tammasaarenkatu",
    "kvarnbo",
    "ouluntie",
    "peltovuoma",
    "tingsvägen",
    "skrapängsvägen",
    "skåldö",
    "savisilta",
    "piisilta",
    "heikinraitti",
    "tatti",
    "kauppakatu",
    "jurmo",
    "degerby",
    "piisilta",
    "skåldö",
    "peltovuoma",
    "piiponraitti",
    "vehkalantie",
    "stormälö",
    "tiilikka",
    "tomtensväg",
    "torikatu",
    "kalevank",
    "larsmo kommun",
]


def extract_non_address_final(row):
    """Extracts and moves non-address parts from the 'street' column to the 'co' column, with robust handling of null values in both 'street' and 'co' columns.

    Args:
        row (pd.Series): A row of the DataFrame.

    Returns:
        pd.Series: Updated 'street' and 'co' values.
    """
    street = row["street"]
    co = row.get("co", "")

    # Handle null or non-string values gracefully
    if not isinstance(street, str) or pd.isnull(street):
        return pd.Series({"street": "", "co": co if isinstance(co, str) else ""})
    if not isinstance(co, str):
        co = ""

    # Split by the first comma
    parts = street.split(",", 1)
    if len(parts) == 2:
        left, right = parts[0].strip(), parts[1].strip()

        # Clean and normalize text for keyword matching
        cleaned_left = re.sub(r"[^\w\s]", "", left).lower()
        cleaned_right = re.sub(r"[^\w\s]", "", right).lower()

        # Check if the right part contains address-related keywords
        if any(keyword in cleaned_right for keyword in address_keywords):
            # If right part is address, move left part to 'co'
            co_part = left
            street = right
        elif any(keyword in cleaned_left for keyword in address_keywords):
            # If left part is address, keep it as address and move right to 'co'
            co_part = right
            street = left
        else:
            # If neither part clearly matches, assume full text is address
            co_part = ""
    else:
        # If no comma is found, assume the whole string is the address
        cleaned_street = re.sub(r"[^\w\s]", "", street).lower()
        if any(keyword in cleaned_street for keyword in address_keywords):
            co_part = ""
        else:
            co_part = street
            street = ""

    # Add the extracted 'co_part' to the 'co' column
    if co_part:
        co = f"{co}, {co_part}".strip(", ") if co else co_part

    return pd.Series({"street": street, "co": co})


def move_non_address_parts_with_keywords(df):
    """Processes a DataFrame to move non-address parts from the 'street' column to the 'co' column, with robust handling of null values.

    Args:
        df (pd.DataFrame): Input DataFrame with 'street' column.

    Returns:
        pd.DataFrame: DataFrame with updated 'street' and 'co' columns.
    """
    # Ensure 'co' column exists
    if "co" not in df.columns:
        df["co"] = ""
    # Apply the refined extraction function row-wise
    df = df.copy()
    df.loc[:, ["street", "co"]] = df.apply(
        lambda row: pd.Series(extract_non_address_final(row)), axis=1
    )
    return df


def hardcoded_corrections(df):
    """Apply hardcoded corrections to rows that are not correctly handled by the previous function.

    Args:
        df (pd.DataFrame): DataFrame after 'move_non_address_parts_with_keywords' has been applied.

    Returns:
        pd.DataFrame: Corrected DataFrame.
    """
    corrections = {
        "2776735-9": {"street": "Firdonkatu", "co": "Mall Of Tripla: Bà Bu"},
        "9209883-3": {"street": "Kalevankatu", "co": "Korvenoja&Palsala Ky"},
        "1602481-6": {"street": "Wallininkuja", "co": "Katutie"},
        "1933826-3": {"street": "Koivujärvi", "co": "Kattilasalmi"},
        "2399059-6": {
            "street": "PL 24",
            "co": "Lohjan Kerto-Tehdas, Metsäliitto Osuuskunta",
        },
        "2941364-2": {"street": "Veturitie", "co": "Mall Of Tripla"},
        "0769845-6": {"street": "Vilhelmintie 2", "co": "Nikunmäki"},
        "1727165-9": {"street": "Vårdberget", "co": "Observatoriet"},
        "0142701-4": {"street": "Maariankatu 4 C", "co": "PL 257"},
        "0923603-6": {"street": "Vehkalantie", "co": "Rimpineva, Raija"},
        "0166307-6": {"street": "Vehkalantie", "co": "Rimpineva, Raija"},
        "1807511-5": {"street": "Hennalankatu", "co": "Rakatu"},
        "2337011-9": {"street": "Kaasutehtaankatu 1", "co": "Rakatu 6"},
        "0211867-8": {"street": "Ruusutie 29", "co": "Rantahaka"},
        "0184151-4": {"street": "Rantakatu", "co": "Rantalinna"},
        "0183892-1": {"street": "Rantakatu", "co": "Rantalinna"},
        "2837415-1": {"street": "Metsänneidonkuja", "co": "Trio katutaso"},
        "0129816-0": {"street": "Torikatu", "co": "Vento as. Tsto Romo, Pesänh.Herman"},
    }

    for business_id, correction in corrections.items():
        df.loc[df["business_id"] == business_id, "street"] = correction["street"]
        df.loc[df["business_id"] == business_id, "co"] = correction["co"]

    return df


def extract_number_and_entrance(row):
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
    df[["street", "building_number", "entrance"]] = df.apply(
        extract_number_and_entrance, axis=1
    )
    return df


def process_file(data):
    """Processes the entire DataFrame by applying all the cleaning functions.

    Args:
        data (pd.DataFrame): The input DataFrame containing address data.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
    data = move_non_address_parts_with_keywords(data)
    data = hardcoded_corrections(data)
    data = move_numbers_to_columns(data)
    return data
