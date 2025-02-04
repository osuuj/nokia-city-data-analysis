from pathlib import Path
from typing import List

import pandas as pd


def read_csv(file_path: str) -> pd.DataFrame:
    """Read a CSV file into a DataFrame.

    Args:
        file_path (str): Path to the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing the CSV data.
    """
    return pd.read_csv(file_path)


def save_to_csv(df: pd.DataFrame, output_file: str) -> None:
    """Save a DataFrame to a CSV file, appending if the file already exists.

    Args:
        df (pd.DataFrame): The DataFrame to save.
        output_file (str): Path to the output CSV file.
    """
    if not df.empty:
        if Path(output_file).exists():
            df.to_csv(
                output_file, mode="a", header=False, index=False, encoding="utf-8"
            )
        else:
            df.to_csv(output_file, index=False, encoding="utf-8")


def read_and_concatenate_csv_files(file_paths: List[str]) -> pd.DataFrame:
    """Read multiple CSV files and concatenate them into one DataFrame.

    Args:
        file_paths (List[str]): List of paths to the CSV files.

    Returns:
        pd.DataFrame: Concatenated DataFrame.
    """
    dataframes = [pd.read_csv(file_path) for file_path in file_paths]
    concatenated_df = pd.concat(dataframes, ignore_index=True)
    return concatenated_df
