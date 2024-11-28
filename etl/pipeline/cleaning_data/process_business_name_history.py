import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date
from etl.config.mappings import Mappings

def process_business_name_history(json_part_data):
    """
    Process the `names` data into a cleaned and structured DataFrame for the `business_name_history` table.

    Args:
        json_part_data (list): List of JSON objects containing business data.

    Returns:
        tuple: (processed DataFrame, error DataFrame)
    """
    if json_part_data is None:
        return pd.DataFrame(), pd.DataFrame()  # Return empty DataFrames if input is None

    rows = []
    error_rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if entry is None:
            continue
        business_id = entry.get("businessId", {}).get("value")

        # Step 2: Extract the names field
        names = entry.get("names", [])
        for name_entry in names:
            name = name_entry.get("name")
            name_type = Mappings.map_name_type(name_entry.get("type", 0))  # Map name_type
            
            # Format dates
            start_date = format_date(name_entry.get("registrationDate"))
            end_date = format_date(name_entry.get("endDate"))

            # Determine if the name is active
            is_active = end_date is None

            # Build the row
            row = {
                "business_id": business_id,
                "name": name,
                "name_type": name_type,
                "start_date": start_date,
                "end_date": end_date,
                "is_active": is_active,
            }

            # Validation: Check for missing critical fields
            if not business_id:
                error_rows.append({**row, "error": "Missing business_id (PRIMARY KEY)"})
                continue
            if not name:
                error_rows.append({**row, "error": "Missing name"})
                continue

            rows.append(row)

    # Step 3: Convert rows to DataFrame
    df = pd.DataFrame(rows)
    error_df = pd.DataFrame(error_rows)

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "name": None,
        "name_type": "Unknown",
        "start_date": None,
        "end_date": None,
        "is_active": True,
    }
    df = handle_missing_values(df, default_values)

    # Step 5: Remove duplicates based on relevant columns
    #primary_key_columns = ["business_id", "name", "start_date"]
    #df = df.drop_duplicates(subset=primary_key_columns, keep="first")

    return df, error_df
