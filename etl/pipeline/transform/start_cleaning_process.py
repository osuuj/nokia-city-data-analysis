"""Start Cleaning Process Script.

This script initializes the cleaning process for extracted CSV files following
the structured cleaning workflow. It performs preprocessing, deduplication,
address-specific cleaning, and prepares data for efficient database loading.

Key Features:
- Standardizes column names and removes irrelevant columns.
- Deduplicates and consolidates records.
- Iteratively cleans address-related columns.
- Moves incomplete records to a staging table.
- Validates data types and ensures database readiness.

"""

from etl.pipeline.transform.cleaning.address_cleaning import clean_addresses
from etl.pipeline.transform.cleaning.base_cleaning import (
    remove_duplicates,
    standardize_column_names,
)
from etl.pipeline.transform.cleaning.post_office_cleaning import clean_post_offices
from etl.utils.file_io import read_csv


def start_cleaning_process(
    input_file: str,
    output_dir: str,
    staging_dir: str,
    entity_name: str,
    resources_dir: str,
) -> None:
    """Executes the cleaning process on extracted CSV files.

    Args:
        input_file (str): Path to the extracted CSV file.
        output_dir (str): Directory to save cleaned data.
        staging_dir (str): Directory to save staging data for later enrichment.
        entity_name (str): Name of the entity being processed.
        resources_dir (str): Path to resources directory for additional reference files.
    """
    df = read_csv(input_file)

    # Step 1: Initial Preprocessing (Keep in memory)
    df = standardize_column_names(df)
    df = remove_duplicates(df)

    # Step 2: Entity-Specific Cleaning
    if entity_name == "post_offices":
        clean_post_offices(df, resources_dir, staging_dir)
    elif entity_name == "addresses":
        clean_addresses(df, staging_dir)

    # elif entity_name == "names":
    #    df, staging_df = clean_names(df, resources_dir)
    # elif entity_name == "companies":
    #    df, staging_df = clean_companies(df, resources_dir)
    # else:
    #    from etl.pipeline.transform.cleaning.base_cleaning import handle_missing_values
    #    df, staging_df = handle_missing_values(df, entity_name, resources_dir)


#
## Step 3: Validate Schema & Data Types (Keep in memory)
# df = validate_data_types(df, entity_name)
#
## Step 4: Save Cleaned Data (Write to disk only once)
# output_file = Path(output_dir) / f"cleaned_{Path(input_file).name}"
# save_to_csv(df, output_file)
# print(f"Cleaned file saved: {output_file}")
#
## Step 5: Save Staging Data (Only if necessary)
# if not staging_df.empty:
#    staging_file = Path(staging_dir) / f"staging_{Path(input_file).name}"
#    save_to_csv(staging_df, staging_file)
#    print(f"Staging file saved: {staging_file}")
