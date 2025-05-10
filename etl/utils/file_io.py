import logging
import os
from pathlib import Path
from typing import List

import pandas as pd

from etl.utils.s3_utils import upload_file_to_s3

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def read_csv(file_path: str) -> pd.DataFrame:
    """Read a CSV file into a DataFrame.

    Args:
        file_path (str): Path to the CSV file.

    Returns:
        pd.DataFrame: DataFrame containing the CSV data.
    """
    df = pd.read_csv(file_path, low_memory=False)
    logger.info(f"Read {len(df)} rows from {file_path}")
    return df


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
        logger.info(f"Saved {len(df)} rows to {output_file}")


def read_and_concatenate_csv_files(file_paths: List[str]) -> pd.DataFrame:
    """Read multiple CSV files and concatenate them into one DataFrame.

    Args:
        file_paths (List[str]): List of paths to the CSV files.

    Returns:
        pd.DataFrame: Concatenated DataFrame.
    """
    dataframes = [pd.read_csv(file_path) for file_path in file_paths]
    concatenated_df = pd.concat(dataframes, ignore_index=True)
    logger.info(
        f"Concatenated {len(concatenated_df)} rows from {len(file_paths)} files"
    )
    return concatenated_df


def save_to_csv_and_upload(
    df: pd.DataFrame, output_file: str, entity_name: str, config: dict
) -> None:
    """Save a DataFrame to a CSV file and upload to S3 if enabled.

    Args:
        df (pd.DataFrame): The DataFrame to save.
        output_file (str): Path to the output CSV file.
        entity_name (str): Name of the entity (for S3 key).
        config (dict): Config dictionary with snapshot_date, language, etc.
    """
    if not df.empty:
        if Path(output_file).exists():
            df.to_csv(
                output_file, mode="a", header=False, index=False, encoding="utf-8"
            )
        else:
            df.to_csv(output_file, index=False, encoding="utf-8")
        logger.info(f"Saved {len(df)} rows to {output_file}")

        # Upload to S3 if enabled
        if os.getenv("USE_S3", "false").lower() == "true":
            bucket = os.getenv("S3_BUCKET")
            snapshot_date = config.get("snapshot_date", "unknown-date")
            language = config.get("language", "unknown-lang")
            s3_key = f"etl/cleaned/{snapshot_date}/{language}/{entity_name}.csv"
            upload_file_to_s3(output_file, bucket, s3_key)
            logger.info(f"Uploaded {output_file} to s3://{bucket}/{s3_key}")
