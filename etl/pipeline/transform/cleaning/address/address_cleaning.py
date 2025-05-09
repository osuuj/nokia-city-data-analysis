"""This module orchestrates the cleaning and standardization of address data.

It includes steps for removing unnecessary columns, filtering invalid rows, standardizing data formats, and validating street names.

"""

import logging
from glob import glob

import pandas as pd

from etl.pipeline.transform.cleaning.address.address_cleaning_helpers import (
    filter_and_save_special_chars_street_addresses,
    filter_clean_and_save_missing_street_addresses,
    process_unmatched_addresses,
    standardize_and_clean_data,
)
from etl.pipeline.transform.cleaning.address.address_helpers import (
    add_columns_from_csv,
    clean_building_number,
    clean_entrance_column,
    clean_street_column,
    drop_unnecessary_columns,
    remove_unusable_rows,
)
from etl.pipeline.transform.cleaning.core.cleaning_utils import (
    normalize_postal_codes,
    remove_invalid_post_codes,
)
from etl.pipeline.transform.cleaning.validation.validate_addresses import (
    validate_street_names,
)
from etl.utils.file_io import read_and_concatenate_csv_files, save_to_csv_and_upload

logger = logging.getLogger(__name__)


def clean_addresses(
    df: pd.DataFrame,
    staging_dir: str,
    output_dir: str,
    config: dict,
    entity_name: str = "addresses",
) -> None:
    """Cleans and standardizes addresses before filtering invalid rows.

    Args:
        df (pd.DataFrame): The raw addresses DataFrame.
        staging_dir (str): Path to save staging files.
        output_dir (str): Path to save cleaned files.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity (default: "addresses").
    """
    logger.info("Starting address cleaning process...")

    try:
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
        df, missing_streets = filter_clean_and_save_missing_street_addresses(df)
        save_to_csv_and_upload(
            missing_streets,
            f"{output_dir}/staging_missing_street.csv",
            "staging_missing_street",
            config,
        )
        df = normalize_postal_codes(df)
        df = drop_unnecessary_columns(df, ["free_address_line"])
        df = filter_and_save_special_chars_street_addresses(df)

        # Step 6: Validate Street Names
        validate_and_save_street_names(df, staging_dir, output_dir, config, entity_name)

        logger.info("Address cleaning process completed successfully.")
    except KeyError as e:
        logger.error(f"Missing column during address cleaning process: {e}")
    except Exception as e:
        logger.error(f"Error during address cleaning process: {e}")


def validate_and_save_street_names(
    df: pd.DataFrame, staging_dir: str, output_dir: str, config: dict, entity_name: str
) -> None:
    """Validate street names and save the results.

    Args:
        df (pd.DataFrame): The input DataFrame.
        staging_dir (str): Path to save staging files.
        output_dir (str): Path to save cleaned files.
        config (dict): Config dictionary for S3 upload.
        entity_name (str): Name of the entity.
    """
    logger.info("Validating street names...")
    finland_path_pattern = "etl/data/resources/*_addresses_2024-11-14.csv"
    finland_file_paths = glob(finland_path_pattern)
    finland_df = read_and_concatenate_csv_files(finland_file_paths)

    address_with_coordinates_df, unmatched_df = validate_street_names(
        df, finland_df, staging_dir
    )

    df_merged = standardize_and_clean_data(address_with_coordinates_df)
    save_to_csv_and_upload(
        df_merged, f"{output_dir}/cleaned_address_data.csv", entity_name, config
    )

    unmatched_df = process_unmatched_addresses(unmatched_df)
    save_to_csv_and_upload(
        unmatched_df,
        f"{output_dir}/staging_unmatch_address_data.csv",
        "staging_unmatch_address_data",
        config,
    )

    logger.info("Street name validation completed.")
