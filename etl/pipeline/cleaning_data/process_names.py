import pandas as pd
from etl.utils.helpers import (
    handle_missing_values,
    map_column_values,
    format_date,
    filter_english_descriptions
)
from etl.config.mappings import Mappings
import logging

logging.basicConfig(level=logging.ERROR)

def process_names(json_part_data):
    """
    Process the `names` data into a cleaned and structured DataFrame for the `names_table`.

    Args:
        json_part_data (list): List of JSON objects containing business data.

    Returns:
        pd.DataFrame: A DataFrame containing the processed names data.
    """
    # Return an empty DataFrame if input is invalid
    if not json_part_data or not isinstance(json_part_data, list):
        logging.error("Input data is invalid or empty.")
        return pd.DataFrame()

    rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if not entry or not isinstance(entry, dict):
            logging.error(f"Invalid entry skipped: {entry}")
            continue

        # Extract business_id safely
        business_id_info = entry.get("businessId")
        business_id = business_id_info.get("value") if isinstance(business_id_info, dict) else None

        # Skip if business_id is missing
        if not business_id:
            logging.error(f"Missing business_id in entry: {entry}")
            continue

        # Extract main business line descriptions (English only)
        main_business_line = entry.get("mainBusinessLine")
        descriptions = []
        if isinstance(main_business_line, dict):
            descriptions = main_business_line.get("descriptions", [])
        english_descriptions = filter_english_descriptions(descriptions) if isinstance(descriptions, list) else []
        business_description = english_descriptions[0] if english_descriptions else None

        # Step 2: Extract the names field
        names = entry.get("names", [])
        if not isinstance(names, list):
            logging.error(f"Invalid 'names' field in entry: {entry}")
            continue

        for name_entry in names:
            if not isinstance(name_entry, dict):
                logging.error(f"Invalid name_entry skipped: {name_entry}")
                continue

            # Safely extract name attributes
            name = name_entry.get("name")
            name_type = name_entry.get("type", 0)  # Map later
            registration_date = format_date(name_entry.get("registrationDate"))
            end_date = format_date(name_entry.get("endDate"))

            # Determine if the name is active (no end date means active)
            is_active = end_date is None

            # Build the row
            row = {
                "business_id": business_id,
                "name": name,
                "type": name_type,  # Map later
                "registration_date": registration_date,
                "is_active": is_active,
                "start_date": registration_date,
                "end_date": end_date,
                "business_description": business_description,  # Add new column
            }
            rows.append(row)

    # Step 3: Convert rows to a DataFrame
    df = pd.DataFrame(rows)

    # Step 4: Map name types using Mappings
    df = map_column_values(df, "type", Mappings.map_name_type)

    # Step 5: Handle missing values
    default_values = {
        "business_id": None,
        "name": None,
        "type": "Unknown",
        "registration_date": None,
        "is_active": True,
        "start_date": None,
        "end_date": None,
        "business_description": None,  # Default for new column
    }
    df = handle_missing_values(df, default_values)

    return df
