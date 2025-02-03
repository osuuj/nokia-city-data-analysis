from pathlib import Path

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
