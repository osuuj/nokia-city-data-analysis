"""Base Cleaning Functions.

This module contains core functions used for standardizing and preprocessing
all extracted CSV files before deeper entity-specific transformations.
"""

import logging
import re

import pandas as pd

logger = logging.getLogger(__name__)


def standardize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize column names to snake_case without excessive underscores.

    Args:
        df (pd.DataFrame): The DataFrame whose column names will be standardized.

    Returns:
        pd.DataFrame: A new DataFrame with column names in snake_case.
    """
    original_columns = df.columns.tolist()

    df.columns = [
        re.sub(
            r"[^a-zA-Z0-9_]",
            "",
            re.sub(r"__+", "_", re.sub(r"([a-z])([A-Z])", r"\1_\2", col)),
        )
        .replace(" ", "_")
        .lower()
        for col in df.columns
    ]

    changed_columns = {
        orig: new for orig, new in zip(original_columns, df.columns) if orig != new
    }

    if changed_columns:
        logger.info(f"Standardized column names: {changed_columns}")

    return df


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows from a DataFrame.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        pd.DataFrame: Deduplicated DataFrame.
    """
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)

    if before > after:
        logger.info(f"Removed {before - after} duplicate rows.")
    else:
        logger.info("No duplicate rows found.")

    return df
