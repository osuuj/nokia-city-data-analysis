import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date
from etl.config.mappings import Mappings

def process_addresses(json_part_data):
    """
    Process the `addresses` data into a cleaned and structured DataFrame for the `addresses` table.

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

        # Step 2: Extract the addresses field
        addresses = entry.get("addresses", [])
        for address in addresses:
            address_type = Mappings.map_address_type(address.get("type"))
            street = address.get("street")
            building_number = address.get("buildingNumber")
            apartment_number = address.get("apartmentNumber")
            post_code = address.get("postCode")
            co = address.get("co")

            # Format start_date and end_date using format_date
            start_date = format_date(address.get("registrationDate"))
            end_date = format_date(address.get("endDate"))

            # Extract city and city_id details from postOffices
            post_offices = address.get("postOffices", [])
            city = post_offices[0].get("city") if post_offices else None
            city_id = post_offices[0].get("municipalityCode") if post_offices else None

            # Build the row
            row = {
                "business_id": business_id,
                "address_type": address_type,
                "street": street,
                "building_number": building_number,
                "apartment_number": apartment_number,
                "post_code": post_code,
                "city": city,  # Add city column
                "city_id": city_id,  # Municipality code
                "co": co,
                "start_date": start_date,
                "end_date": end_date,
            }

            # Validation: Check for missing required fields
            if not business_id:
                error_rows.append({**row, "error": "Missing business_id (PRIMARY KEY)"})
                continue
            if not address_type:
                error_rows.append({**row, "error": "Missing address_type"})
                continue

            rows.append(row)

    # Step 3: Convert rows to a DataFrame
    df = pd.DataFrame(rows)
    error_df = pd.DataFrame(error_rows)

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "address_type": "Unknown",
        "street": None,
        "building_number": None,
        "apartment_number": None,
        "post_code": None,
        "city": None,  # Handle missing city
        "city_id": None,
        "co": None,
        "start_date": None,
        "end_date": None,
    }
    df = handle_missing_values(df, default_values)

    # Step 5: Enforce Data Types and Format Dates
    df["start_date"] = df["start_date"].apply(format_date)
    df["end_date"] = df["end_date"].apply(format_date)

    # Step 6: Remove duplicates
    #unique_columns = [
    #    "business_id", "address_type", "street",
    #    "building_number", "post_code", "city_id",
    #    "start_date"
    #]
    #df = df.drop_duplicates(subset=unique_columns, keep="first")

    return df, error_df
