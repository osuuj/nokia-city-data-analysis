"""Utilities for splitting large files into smaller chunks.

This module provides functions for splitting large JSON files into smaller chunks
and saving DataFrames to CSV files in chunks.
"""

import ijson
import json
import logging
from pathlib import Path
from typing import Any

import pandas as pd

logger = logging.getLogger(__name__)


from memory_profiler import profile


@profile
def split_json_to_files(file_path: str, output_dir: str, chunk_size: int) -> None:
    """Split a large JSON file into smaller files using streaming.

    Args:
        file_path (str): Path to the large JSON file.
        output_dir (str): Directory where the smaller files will be saved.
        chunk_size (int): Number of records per chunk.

    Raises:
        FileNotFoundError: If the input file does not exist.
        ValueError: If the chunk_size is invalid or if the JSON file format is unsupported.
        RuntimeError: If an error occurs during splitting.
    """
    input_path = Path(file_path)
    output_path = Path(output_dir)

    if not input_path.exists():
        raise FileNotFoundError(f"Input file does not exist: {file_path}")

    if chunk_size <= 0:
        raise ValueError("Chunk size must be a positive integer.")

    logger.info(f"Splitting JSON file: {file_path} into chunks of size {chunk_size}")

    output_path.mkdir(parents=True, exist_ok=True)

    try:
        with input_path.open("r", encoding="utf-8") as file:
            parser = ijson.items(file, "item")
            chunk = []
            chunk_index = 0

            for index, record in enumerate(parser, start=1):
                chunk.append(record)
                if len(chunk) >= chunk_size:
                    save_chunk(chunk, output_path, chunk_index)
                    chunk = []
                    chunk_index += 1

            # Save any remaining records
            if chunk:
                save_chunk(chunk, output_path, chunk_index)

    except Exception as e:
        logger.error(f"Error during splitting JSON file {file_path}: {e}")
        raise RuntimeError(f"Failed to split JSON file {file_path}") from e


def save_chunk(chunk: list[Any], output_path: Path, chunk_index: int) -> None:
    """Save a chunk of data to a JSON file.

    Args:
        chunk (list[Any]): Chunk of data to save.
        output_path (Path): Directory where the file will be saved.
        chunk_index (int): Index of the chunk for naming.
    """
    output_file = output_path / f"chunk_{chunk_index}.json"
    with output_file.open("w", encoding="utf-8") as out_file:
        json.dump(chunk, out_file, indent=4)
    logger.info(f"Saved chunk {chunk_index} with {len(chunk)} records to {output_file}")


def save_to_csv_in_chunks(
    df: pd.DataFrame, output_base_name: str, chunk_size: int
) -> None:
    """Save a DataFrame to multiple CSV files in chunks.

    Args:
        df (pd.DataFrame): The DataFrame to save.
        output_base_name (str): Base name for the output CSV files.
        chunk_size (int): Number of records per chunk.

    Raises:
        ValueError: If the chunk size is not positive.
    """
    if chunk_size <= 0:
        raise ValueError("Chunk size must be a positive integer.")

    num_chunks = (len(df) + chunk_size - 1) // chunk_size  # Calculate number of chunks
    logger.info(
        f"Saving DataFrame to {num_chunks} CSV files with chunk size {chunk_size}"
    )

    output_base_path = Path(output_base_name)

    for i in range(num_chunks):
        chunk = df.iloc[i * chunk_size : (i + 1) * chunk_size]
        chunk_file_name = output_base_path.with_name(
            f"{output_base_path.stem}_part{i + 1}.csv"
        )
        try:
            chunk.to_csv(chunk_file_name, index=False, encoding="utf-8")
            logger.info(f"Saved chunk {i + 1} to {chunk_file_name}")
        except Exception as e:
            logger.error(f"Error writing chunk {i + 1} to {chunk_file_name}: {e}")
