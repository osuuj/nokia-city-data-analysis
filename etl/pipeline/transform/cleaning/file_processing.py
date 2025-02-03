from pathlib import Path

import pandas as pd

from server.cleaning_tables.scripts.clean_inspection import clean_and_filter_rows
from server.cleaning_tables.scripts.cleaning.addresses_cleaning import (
    basic_cleaning,
    drop_unnecessary_columns,
    filter_street_column,
)
from server.cleaning_tables.scripts.parsing_utils import normalize_and_extract_co
from server.cleaning_tables.scripts.with_comma import process_file
from server.cleaning_tables.scripts.without_comma import (
    clean_without_comma,
    process_street_column,
)


def process_csv(file_path: Path, output_dir: Path):
    print(f"Reading {file_path}...")
    df = pd.read_csv(file_path)
    print("Start cleaning...")
    cleaned_df = basic_cleaning(df)
    print("Cleaned DataFrame:")

    print("Filtering rows for inspection...")
    inspection_df = filter_street_column(cleaned_df.copy(), filter_type="inspection")

    # Remove inspection rows from cleaned_df before applying clean_and_filter_rows
    cleaned_df = cleaned_df[~cleaned_df.index.isin(inspection_df.index)]

    # Apply clean_and_filter_rows to inspection_df
    inspection_df = drop_unnecessary_columns(
        inspection_df.copy(),
        [
            "street",
            "building_number",
            "apartment_id_suffix",
            "entrance",
            "apartment_number",
        ],
    )
    inspection_df = clean_and_filter_rows(inspection_df)
    inspection_file = output_dir / f"inspection_{file_path.name}"
    inspection_df.to_csv(inspection_file, index=False)
    print(f"Inspection file saved: {inspection_file}")

    print("Filtering rows with special characters...")
    special_char_df = filter_street_column(
        cleaned_df.copy(), filter_type="special_characters"
    )
    cleaned_df = cleaned_df[~cleaned_df.index.isin(special_char_df.index)]

    output_file = output_dir / f"cleaned_{file_path.name}"
    cleaned_df = drop_unnecessary_columns(cleaned_df.copy(), ["free_address_line"])
    cleaned_df.to_csv(output_file, index=False)
    print(f"Cleaned_Addresses file saved: {output_file}")

    print("Processing waiting_to_parsing...")
    normalized_df = normalize_and_extract_co(special_char_df.copy())
    print("Filtering rows without commas...")
    without_comma_df = filter_street_column(
        normalized_df.copy(), filter_type="without_comma"
    )
    print("Filtering rows with commas...")
    with_comma_df = filter_street_column(normalized_df.copy(), filter_type="with_comma")

    print("Cleaning rows without commas...")
    cleaned_without_comma_df = clean_without_comma(without_comma_df.copy())
    with_number_df = filter_street_column(
        cleaned_without_comma_df.copy(), filter_type="with_number"
    )
    # Remove rows in with_number_df from cleaned_without_comma_df
    cleaned_without_comma_df = cleaned_without_comma_df[
        ~cleaned_without_comma_df.index.isin(with_number_df.index)
    ].copy()

    processed_street_df = process_street_column(with_number_df.copy())
    final_without_comma_df = pd.concat([cleaned_without_comma_df, processed_street_df])
    cleaned_with_comma_df = process_file(with_comma_df.copy())
    final_df = pd.concat([final_without_comma_df, cleaned_with_comma_df])
    final_df = drop_unnecessary_columns(
        final_df, ["free_address_line", "apartment_id_suffix"]
    )
    final_output_file = output_dir / "cleaned_parsed_addresses.csv"
    final_df.to_csv(final_output_file, index=False)
    print(f"Combined cleaned and parsed addresses file saved: {final_output_file}")
