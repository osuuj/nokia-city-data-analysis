import pandas as pd
from etl.utils.helpers import handle_missing_values, map_column_values, format_date
from etl.config.mappings import Mappings

def process_business_info(json_part_data):
    """
    Process the `business_info` data into a cleaned and structured DataFrame.
    """
    if json_part_data is None:
        return pd.DataFrame()  # Return an empty DataFrame if input is None

    rows = []

    # Step 1: Iterate through each entry
    for entry in json_part_data:
        if entry is None:
            continue
        # Safely access nested fields
        business_id_info = entry.get("businessId", {})
        business_id = business_id_info.get("value") if business_id_info else None
        registration_date = business_id_info.get("registrationDate") if business_id_info else None
        
        status = entry.get("status", None)
        last_modified = entry.get("lastModified", None)

        website_info = entry.get("website", {})
        website = website_info.get("url") if website_info else None
        website_registered_date = website_info.get("registrationDate") if website_info else None

        # Build a row dictionary
        row = {
            "business_id": business_id,
            "registration_date": registration_date,
            "status": status,
            "website": website,
            "website_registered_date": website_registered_date,
            "last_modified": last_modified,
        }
        rows.append(row)

    # Step 2: Convert rows to DataFrame
    df = pd.DataFrame(rows)

    # Step 3: Ensure required columns exist
    required_columns = [
        "business_id", "registration_date", "status",
        "website", "website_registered_date", "last_modified"
    ]
    for col in required_columns:
        if col not in df.columns:
            df[col] = None  # Add missing columns with default value

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "registration_date": None,
        "status": "unknown",
        "website": None,
        "website_registered_date": None,
        "last_modified": None,
    }
    df = handle_missing_values(df, default_values)

    # Map status values using Mappings
    df = map_column_values(df, "status", Mappings.map_status)

    # Step 6: Format `last_modified` column using format_date
    if "last_modified" in df.columns:
        df["last_modified"] = df["last_modified"].apply(format_date)

    # Step 7: Remove duplicates
    df = df.drop_duplicates(subset=["business_id"], keep="first")

    return df
