import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date, filter_english_descriptions
from etl.config.mappings import Mappings

import logging

logging.basicConfig(level=logging.ERROR)

def process_registered_entries(json_part_data):
    """
    Process the `registeredEntries` data into a cleaned and structured DataFrame for the `registered_entries` table.

    Args:
        json_part_data (list): List of JSON objects containing business data.

    Returns:
        tuple: (processed DataFrame, error DataFrame)
    """
    if json_part_data is None:
        logging.error("Input data is None.")
        return pd.DataFrame(), pd.DataFrame()  # Return empty DataFrames if input is None

    rows = []
    error_rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if not entry or not isinstance(entry, dict):
            logging.error(f"Invalid entry skipped: {entry}")
            error_rows.append({"entry": entry, "error": "Invalid entry format"})
            continue

        business_id = entry.get("businessId", {}).get("value") if entry.get("businessId") else None

        # Skip if business_id is missing
        if not business_id:
            logging.error(f"Missing business_id in entry: {entry}")
            error_rows.append({"entry": entry, "error": "Missing business_id"})
            continue

        # Step 2: Extract the registeredEntries field
        registered_entries = entry.get("registeredEntries", [])
        if not isinstance(registered_entries, list):
            logging.error(f"Invalid 'registeredEntries' field in entry: {entry}")
            error_rows.append({"entry": entry, "error": "Invalid 'registeredEntries' field"})
            continue

        for reg_entry in registered_entries:
            if not reg_entry or not isinstance(reg_entry, dict):
                logging.error(f"Invalid registered entry skipped: {reg_entry}")
                error_rows.append({"entry": reg_entry, "error": "Invalid registered entry format"})
                continue

            # Extract English descriptions
            descriptions = reg_entry.get("descriptions", [])
            english_descriptions = filter_english_descriptions(descriptions)
            description = english_descriptions[0] if english_descriptions else None

            # Map the register and authority
            register = Mappings.map_register(reg_entry.get("register")) if reg_entry.get("register") else "Unknown"
            authority = Mappings.map_authority(reg_entry.get("authority")) if reg_entry.get("authority") else "Unknown"

            # Format the registration_date and end_date using format_date
            registration_date = format_date(reg_entry.get("registrationDate"))
            end_date = format_date(reg_entry.get("endDate"))

            # Build the row
            row = {
                "business_id": business_id,
                "description": description,
                "registration_date": registration_date,
                "register": register,
                "authority": authority,
                "end_date": end_date
            }

            # Validation: Ensure critical fields are present
            if not description:
                logging.error(f"Missing description in registered entry: {reg_entry}")
                error_rows.append({**row, "error": "Missing description"})
                continue

            rows.append(row)

    # Step 3: Convert rows to DataFrame
    df = pd.DataFrame(rows)
    error_df = pd.DataFrame(error_rows)

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "description": None,
        "registration_date": None,
        "register": "Unknown",
        "authority": "Unknown",
        "end_date": None
    }
    df = handle_missing_values(df, default_values)

    # Step 5: Remove duplicates based on relevant columns
    #primary_key_columns = ["business_id", "description", "registration_date"]
    #df = df.drop_duplicates(subset=primary_key_columns, keep="first")

    return df, error_df
