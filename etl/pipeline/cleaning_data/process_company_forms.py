import pandas as pd
from etl.utils.helpers import handle_missing_values, format_date, filter_english_descriptions
from etl.config.mappings import Mappings

def process_company_forms(json_part_data):
    """
    Process the `companyForms` data into a cleaned and structured DataFrame for the `company_forms` table.
    """
    if json_part_data is None:
        return pd.DataFrame()  # Return an empty DataFrame if input is None

    rows = []

    # Step 1: Iterate through each business entry
    for entry in json_part_data:
        if entry is None:
            continue
        business_id = entry.get("businessId", {}).get("value")

        # Step 2: Extract the companyForms field
        company_forms = entry.get("companyForms", [])
        for form in company_forms:
            # Map form_type
            form_type = Mappings.map_company_form_type(form.get("type"))
            
            # Extract English descriptions
            descriptions = form.get("descriptions", [])
            english_descriptions = filter_english_descriptions(descriptions)
            description = english_descriptions[0] if english_descriptions else None

            # Format registration_date and end_date using format_date
            registration_date = format_date(form.get("registrationDate"))
            end_date = format_date(form.get("endDate"))

            # Build the row
            row = {
                "business_id": business_id,
                "form_type": form_type,
                "description": description,
                "registration_date": registration_date,
                "end_date": end_date,
            }
            rows.append(row)

    # Step 3: Convert rows to a DataFrame
    df = pd.DataFrame(rows)

    # Step 4: Handle missing values
    default_values = {
        "business_id": None,
        "form_type": "Unknown",
        "description": None,
        "registration_date": None,
        "end_date": None,
    }
    df = handle_missing_values(df, default_values)

    # Step 5: Remove duplicates based on PRIMARY KEY columns
    # primary_key_columns = ["business_id", "form_type", "registration_date"]
    # df = df.drop_duplicates(subset=primary_key_columns, keep="first")

    return df

