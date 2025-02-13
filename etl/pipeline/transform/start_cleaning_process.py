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

from etl.pipeline.transform.cleaning.address.address_cleaning import clean_addresses
from etl.pipeline.transform.cleaning.companies.companies_cleaning import clean_companies
from etl.pipeline.transform.cleaning.core.base_cleaning import (
    remove_duplicates,
    standardize_column_names,
)
from etl.pipeline.transform.cleaning.core.final_cleaning import (
    clean_company_forms,
    clean_company_situations,
    clean_main_business_lines,
    clean_registered_entries,
)
from etl.pipeline.transform.cleaning.names.names_cleaning import clean_names
from etl.pipeline.transform.cleaning.post_office.post_office_cleaning import (
    clean_post_offices,
)
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
    # Step 1: Load and preprocess
    df = read_csv(input_file)
    df = standardize_column_names(df)
    df = remove_duplicates(df)

    # Step 2: Entity-Specific Cleaning
    if entity_name == "post_offices":
        clean_post_offices(df, resources_dir, staging_dir)
    elif entity_name == "addresses":
        clean_addresses(df, staging_dir, output_dir)
    elif entity_name == "names":
        clean_names(df, staging_dir, output_dir)
    elif entity_name == "companies":
        clean_companies(df, staging_dir, output_dir)
    elif entity_name == "company_forms":
        clean_company_forms(df, output_dir)
    elif entity_name == "company_situations":
        clean_company_situations(df, output_dir)
    elif entity_name == "main_business_lines":
        clean_main_business_lines(df, output_dir)
    elif entity_name == "registered_entries":
        clean_registered_entries(df, output_dir)
