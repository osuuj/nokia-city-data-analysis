"""ETL Pipeline Orchestration Script.

This script orchestrates the ETL pipeline, including:
1. Environment setup.
2. Downloading and extracting raw data.
3. Downloading required mappings.
4. Splitting JSON files into chunks.
5. Processing entities based on extracted data.

Key Features:
- Modular and reusable pipeline steps.
- Robust error handling and logging.
"""

import time
import json
import ijson
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List

from etl.config.config_loader import load_all_configs
from etl.config.logging.logging_config import configure_logging, get_logger
from etl.scripts.entity_processing import process_entities
from etl.scripts.data_fetcher import download_and_extract_files
from etl.utils.file_system_utils import setup_directories
from etl.utils.network_utils import download_mapping_files, get_url

# Configure logging
configure_logging()
logger = get_logger()
logger.info("Starting ETL pipeline")


def setup_environment(config: Dict[str, Any]) -> None:
    """Set up the environment by ensuring necessary directories exist.

    Args:
        config (Dict[str, Any]): Configuration dictionary with directory structure.
    """
    directories_to_create = [
        Path(v)
        for k, v in config["directory_structure"].items()
        if k != "db_schema_path"
    ]
    setup_directories(directories_to_create)
    logger.info("Environment setup completed.")


def download_raw_data(config: Dict[str, Any]) -> Path:
    """Download and extract raw data files from a specified URL.

    Args:
        config (Dict[str, Any]): Configuration dictionary containing URL and file paths.

    Returns:
        Path: Directory containing the extracted files.
    """
    url = get_url("all_companies", config["url_templates"])
    raw_file_path = (
        Path(config["directory_structure"]["raw_dir"])
        / config["file_names"]["zip_file_name"]
    )
    extracted_dir = Path(config["directory_structure"]["extracted_dir"])
    download_and_extract_files(url, raw_file_path, extracted_dir, config["chunk_size"])
    logger.info("Raw data downloaded and extracted.")
    return extracted_dir


def download_mappings(config: Dict[str, Any]) -> None:
    """Download mapping files required for data processing.

    Args:
        config (Dict[str, Any]): Configuration dictionary containing mapping file details.
    """
    base_url = config["url_templates"]["base"]
    endpoint_template = config["url_templates"]["endpoints"]["description"]
    mappings_path = Path(config["directory_structure"]["raw_dir"]) / "mappings"
    mappings_path.mkdir(parents=True, exist_ok=True)
    download_mapping_files(
        base_url, endpoint_template, config["codes"], config["languages"], mappings_path
    )
    logger.info("JSON mappings downloaded.")


def process_json_file(json_file: Path) -> pd.DataFrame:
    """Convert a JSON file into a Pandas DataFrame.

    Args:
        json_file (Path): Path to the JSON file.

    Returns:
        pd.DataFrame: DataFrame containing JSON data.
    """
    all_rows = []
    try:
        with json_file.open("r", encoding="utf-8") as file:
            data = json.load(file)
            if isinstance(data, list):
                all_rows.extend([item for item in data if isinstance(item, dict)])
            else:
                logger.error(f"Expected a list in {json_file}, got {type(data)}")
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON in {json_file}: {e}")
    return pd.DataFrame(all_rows)


def split_json_to_files(file_path: str, output_dir: str, chunk_size: int) -> None:
    """Split a large JSON file into smaller files using streaming.

    Args:
        file_path (str): Path to the input JSON file.
        output_dir (str): Directory to save the smaller chunk files.
        chunk_size (int): Number of records per chunk.
    """
    input_path = Path(file_path)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    with input_path.open("r", encoding="utf-8") as file:
        parser = ijson.items(file, "item")
        chunk = []
        chunk_index = 0

        for record in parser:
            chunk.append(record)
            if len(chunk) >= chunk_size:
                save_chunk(chunk, output_path, chunk_index)
                chunk = []
                chunk_index += 1

        if chunk:
            save_chunk(chunk, output_path, chunk_index)


def save_chunk(chunk: List[Any], output_path: Path, chunk_index: int) -> None:
    """Save a chunk of data to a JSON file.

    Args:
        chunk (List[Any]): List of JSON records to save.
        output_path (Path): Directory to save the chunk file.
        chunk_index (int): Index for naming the chunk file.
    """
    output_file = output_path / f"chunk_{chunk_index}.json"
    with output_file.open("w", encoding="utf-8") as out_file:
        json.dump(chunk, out_file, indent=4)
    logger.info(f"Saved chunk {chunk_index} to {output_file}")


def get_first_json_file(extracted_dir: Path) -> Path:
    """Retrieve the first JSON file from a directory.

    Args:
        extracted_dir (Path): Directory containing JSON files.

    Returns:
        Path: Path to the first JSON file.

    Raises:
        FileNotFoundError: If no JSON files are found.
    """
    json_files = list(extracted_dir.glob("*.json"))
    if not json_files:
        raise FileNotFoundError(f"No JSON files found in directory: {extracted_dir}")
    return json_files[0]


def run_etl_pipeline() -> None:
    """Execute the ETL pipeline."""
    start_time = time.time()
    config = load_all_configs()

    try:
        # Step 1: Environment setup
        # setup_environment(config)

        # Step 2: Download and extract raw data
        # extracted_dir = download_raw_data(config)

        # Step 3: Download mappings
        # download_mappings(config)

        # Step 4: Process JSON chunks
        # input_json_file = get_first_json_file(Path(extracted_dir))
        split_dir = Path(config["directory_structure"]["processed_dir"]) / "chunks"
        # split_json_to_files(str(input_json_file), str(split_dir), config["chunk_size"])

        # Step 5: Process entities
        for json_file in split_dir.glob("chunk_*.json"):
            data_records = process_json_file(json_file)
            process_entities(data_records, config)

        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise


if __name__ == "__main__":
    run_etl_pipeline()
