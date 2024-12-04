"""
Utilities for applying mappings to dataframes or values.
"""
import logging
import pandas as pd
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

def apply_column_mapping(df, column, mappings: Mappings, mapping_name, lang):
    """
    Applies a mapping to a specific column in a DataFrame.

    Args:
        df (pd.DataFrame): The DataFrame to transform.
        column (str): The column to apply the mapping to.
        mappings (Mappings): Mappings object.
        mapping_name (str): Name of the mapping to retrieve.
        lang (str): Language code (e.g., 'fi', 'en', 'sv').

    Returns:
        pd.DataFrame: Transformed DataFrame.
    """
    try:
        mapping = mappings.get_mapping(mapping_name, lang)
        if column in df.columns:
            df[column] = df[column].map(mapping).fillna(df[column])
        else:
            logger.warning(f"Column {column} not found in DataFrame.")
    except KeyError as e:
        logger.error(f"Mapping error for {mapping_name}: {e}")
    return df
