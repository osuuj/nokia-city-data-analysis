import logging
from pathlib import Path
import pandas as pd
from etl.utils.cleaning_utils import (
    transform_column_names,
    handle_missing_values,
    enforce_column_types,
    remove_duplicates,
)
from etl.utils.mapping_utils import apply_column_mapping
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

def clean_dataset(input_file, output_file, mappings_file, column_types, lang):
    """
    Cleans a single dataset file using centralized mappings and type rules.

    Args:
        input_file (str): Path to the input CSV file.
        output_file (str): Path to the cleaned CSV file.
        mappings_file (str): Path to the YAML file with mappings.
        column_types (dict): Column type definitions.
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").
    """
    try:
        # Load mappings
        mappings = Mappings(mappings_file)

        # Read dataset
        df = pd.read_csv(input_file)

        # Apply cleaning steps
        df = handle_missing_values(df)
        df = enforce_column_types(df, column_types)
        for column, mapping_name in column_types.items():
            df = apply_column_mapping(df, column, mappings, mapping_name, lang)
        df = remove_duplicates(df)
        df = transform_column_names(df)

        # Save cleaned dataset
        df.to_csv(output_file, index=False)
        logger.info(f"Cleaned file saved: {output_file}")
    except Exception as e:
        logger.error(f"Error cleaning file {input_file}: {e}")
