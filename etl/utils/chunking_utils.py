"""
Utility for splitting large JSON files into smaller chunks.

This module provides a function to divide large JSON files into
smaller JSON files of a specified size. It is designed to handle
memory-efficient processing of large datasets.
"""
import os
import pandas as pd
import json
import logging

logger = logging.getLogger(__name__)

def split_json_to_files(file_path, output_dir, chunk_size):
    """
    Splits a large JSON file into smaller JSON files.

    :param file_path: Path to the input JSON file
    :param output_dir: Directory where chunks will be saved
    :param chunk_size: Number of records per chunk
    """
    logger.info(f"Splitting JSON file: {file_path} into chunks of size {chunk_size}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        chunk = []
        chunk_index = 1

        with open(file_path, 'r', encoding='utf-8') as file:
            for record in json.load(file):
                chunk.append(record)
                if len(chunk) >= chunk_size:
                    output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
                    with open(output_file, 'w', encoding='utf-8') as out_file:
                        json.dump(chunk, out_file, indent=4)
                    logger.info(f"Saved chunk {chunk_index} with {len(chunk)} records to {output_file}")
                    chunk = []  # Clear the buffer
                    chunk_index += 1

            # Write remaining records
            if chunk:
                output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
                with open(output_file, 'w', encoding='utf-8') as out_file:
                    json.dump(chunk, out_file, indent=4)
                logger.info(f"Saved final chunk {chunk_index} with {len(chunk)} records to {output_file}")
    except IOError as e:
        logger.error(f"File I/O error during splitting JSON file {file_path}: {e}")
        raise
    except Exception as e:
        logger.error(f"Error during splitting JSON file {file_path}: {e}")
        raise

def save_to_csv_in_chunks(df: pd.DataFrame, output_base_name: str, chunk_size: int) -> None:
    """
    Save a DataFrame to multiple CSV files in chunks.

    :param df: DataFrame to save.
    :param output_base_name: Base name for output files.
    :param chunk_size: Number of records per chunk.
    """
    num_chunks = (len(df) + chunk_size - 1) // chunk_size
    for i in range(num_chunks):
        chunk = df.iloc[i * chunk_size:(i + 1) * chunk_size]
        chunk_file_name = f"{output_base_name}_part{i + 1}.csv"
        chunk.to_csv(chunk_file_name, index=False, encoding='utf-8')
        logger.info(f"Saved chunk {i + 1} to {chunk_file_name}")
