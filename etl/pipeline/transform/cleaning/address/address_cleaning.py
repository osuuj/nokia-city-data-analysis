import logging
from glob import glob

import pandas as pd

from etl.pipeline.transform.cleaning.address.address_helpers import (
    add_columns_from_csv,
    clean_building_number,
    clean_entrance_column,
    clean_street_column,
    drop_unnecessary_columns,
    filter_street_column,
    remove_unusable_rows,
)
from etl.pipeline.transform.cleaning.core.cleaning_utils import (
    normalize_postal_codes,
    remove_invalid_post_codes,
)
from etl.pipeline.transform.cleaning.validation.validate_addresses import (
    validate_street_names,
)
from etl.utils.file_io import read_and_concatenate_csv_files, save_to_csv

logger = logging.getLogger(__name__)


def clean_addresses(df: pd.DataFrame, staging_dir: str):
    """Cleans and standardizes addresses before filtering invalid rows.

    Args:
        df (pd.DataFrame): The raw addresses DataFrame.
        staging_dir (str): Path to save staging files.

    Returns:
        pd.DataFrame: The cleaned and validated DataFrame.
    """
    logger.info("Starting address cleaning process...")

    # Step 1: Remove Unnecessary Columns
    df = drop_unnecessary_columns(df, ["apartment_id_suffix", "post_office_box"])

    # Step 2: Remove Unusable Rows (Missing Key Address Components)
    df = remove_unusable_rows(
        df, ["street", "building_number", "entrance", "co", "free_address_line"]
    )

    # Step 3: Remove Invalid Post Codes
    df = remove_invalid_post_codes(df)

    # Step 4: Standardization & Cleaning
    df = clean_building_number(df)
    df = clean_entrance_column(df)
    df = clean_street_column(df)
    df = add_columns_from_csv(df, staging_dir)

    # Step 5: Filter & Move Data to Staging
    # Filter and save missing street addresses
    missing_street = filter_street_column(df, filter_type="missing")
    if not missing_street.empty:
        save_to_csv(missing_street, f"{staging_dir}/staging_missing_street.csv")
        df = df.drop(missing_street.index)

    # Normalize postal codes
    df = normalize_postal_codes(df)

    # Filter and save special characters street addresses
    special_chars_street = filter_street_column(df, filter_type="special_characters")
    special_chars_street = drop_unnecessary_columns(
        special_chars_street, ["free_address_line"]
    )
    if not special_chars_street.empty:
        save_to_csv(
            special_chars_street, f"{staging_dir}/staging_special_chars_street.csv"
        )
        df = df.drop(special_chars_street.index)

    # Filter and save long street addresses
    more_than_two_words_street = filter_street_column(df, filter_type="long_street")
    more_than_two_words_street = drop_unnecessary_columns(
        more_than_two_words_street, ["free_address_line"]
    )
    if not more_than_two_words_street.empty:
        save_to_csv(
            more_than_two_words_street, f"{staging_dir}/staging_long_street.csv"
        )
        df = df.drop(more_than_two_words_street.index)

    # Drop the 'free_address_line' column from relevant DataFrames
    df = drop_unnecessary_columns(df, ["free_address_line"])
    save_to_csv(df, f"{staging_dir}/staging_addresses.csv")

    # Step 6: Validate Street Names
    try:
        logger.info("Validating street names...")
        finland_path_pattern = "etl/data/resources/*_addresses_2024-11-14.csv"
        finland_file_paths = glob(finland_path_pattern)
        finland_df = read_and_concatenate_csv_files(finland_file_paths)

        address_with_coordinates_df, unmatched_df = validate_street_names(
            df, finland_df, f"{staging_dir}"
        )
        logger.info("Street name validation completed.")
    except Exception as e:
        logger.error(f"Error during street validation: {e}")
