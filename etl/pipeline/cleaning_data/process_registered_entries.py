import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date, filter_english_descriptions
from etl.config.mappings import Mappings

def process_registered_entries(json_part_data):
    """
    Process the `registeredEntries` data into a cleaned and structured DataFrame for the `registered_entries` table.

    Args:
        json_part_data (list): List of JSON objects containing business data.

    Returns:
        pd.DataFrame: A DataFrame containing the processed registered entries data.
    """
    if json_part_data is None:
        return pd.DataFrame()  # Return an empty DataFrame if input is None

    rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if entry is None:
            continue
        business_id = entry.get("businessId", {}).get("value") if entry.get("businessId") else None

        # Skip if business_id is missing
        if not business_id:
            continue

        # Step 2: Extract the registeredEntries field
        registered_entries = entry.get("registeredEntries", [])
        for reg_entry in registered_entries:
            # Validate reg_entry before processing
            if not reg_entry or not isinstance(reg_entry, dict):
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
                "end_date": end_date  # Optional: Include end_date if relevant
            }
            rows.append(row)

    # Step 3: Convert rows to a DataFrame
    df = pd.DataFrame(rows)

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "description": None,
        "registration_date": None,
        "register": "Unknown",
        "authority": "Unknown",
        "end_date": None  # Optional: Handle missing end_date
    }
    df = handle_missing_values(df, default_values)

    # Step 5: Remove duplicates based on PRIMARY KEY columns
    #primary_key_columns = ["business_id", "description", "registration_date"]
    #df = df.drop_duplicates(subset=primary_key_columns, keep="first")

    return df
