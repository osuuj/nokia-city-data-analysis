import logging

import pandas as pd

from etl.pipeline.transform.cleaning.address_helpers import (
    add_columns_from_csv,
    clean_building_number,
    clean_entrance_column,
    clean_street_column,
    drop_unnecessary_columns,
    filter_street_column,
    remove_unusable_rows,
)
from etl.pipeline.transform.cleaning.cleaning_utils import (
    normalize_postal_codes,
    remove_invalid_post_codes,
)
from etl.pipeline.transform.cleaning.validate_addresses import validate_street_names
from etl.utils.file_io import save_to_csv

logger = logging.getLogger(__name__)


def clean_addresses(df: pd.DataFrame, staging_dir: str):
    """Cleans and standardizes addresses before filtering invalid rows.

    Args:
        df (pd.DataFrame): The raw addresses DataFrame.
        staging_dir (str): Path to resources for additional reference files.

    Returns:
        pd.DataFrame: The cleaned DataFrame.
    """
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
    missing_street = filter_street_column(df, filter_type="missing")
    if not missing_street.empty:
        save_to_csv(missing_street, f"{staging_dir}/staging_missing_street.csv")
        df = df.drop(missing_street.index)

    df = normalize_postal_codes(df)
    special_chars_street = filter_street_column(df, filter_type="special_characters")
    special_chars_street = drop_unnecessary_columns(
        special_chars_street, ["free_address_line"]
    )
    if not special_chars_street.empty:
        save_to_csv(
            special_chars_street, f"{staging_dir}/staging_special_chars_street.csv"
        )
        df = df.drop(special_chars_street.index)

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

    # Validate and modify street names
    validate_street_names()
    # df = validate_street_names(
    #    df, reference_path="etl/data/resources/Finland_addresses_2024-11-14.csv"
    # )
