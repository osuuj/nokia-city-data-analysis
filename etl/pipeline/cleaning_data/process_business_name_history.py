import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date
from etl.config.mappings import Mappings

def process_business_name_history(json_part_data):
    """
    Process the `names` data into a cleaned and structured DataFrame for the `business_name_history` table.

    Args:
        json_part_data (list): List of JSON objects containing business data.

    Returns:
        pd.DataFrame: A DataFrame containing the processed business name history data.
    """
    if json_part_data is None:
        return pd.DataFrame()  # Return an empty DataFrame if input is None

    rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if entry is None:
            continue
        business_id = entry.get("businessId", {}).get("value")

        # Step 2: Extract the names field
        names = entry.get("names", [])
        for name_entry in names:
            name = name_entry.get("name")
            # Map name_type
            name_type = Mappings.map_name_type(name_entry.get("type", 0))
            
            # Format start_date and end_date using format_date
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
            rows.append(row)

    # Step 3: Convert rows to a DataFrame
    df = pd.DataFrame(rows)

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

    # Step 5: Remove duplicates based on PRIMARY KEY columns
    #primary_key_columns = ["business_id", "name", "start_date"]
    #df = df.drop_duplicates(subset=primary_key_columns, keep="first")

    return df
