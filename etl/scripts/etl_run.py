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

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Union
import ijson
import pandas as pd

from etl.config.config_loader import load_all_configs
from etl.config.logging.logging_config import configure_logging, get_logger
from etl.scripts.data_fetcher import download_and_extract_files
from etl.scripts.entity_processing import process_entities
from etl.utils.file_system_utils import setup_directories
from etl.utils.network_utils import download_mapping_files, get_url
from etl.pipeline.transform.cleaning import clean_entity_files

# Configure logging
configure_logging()
logger = get_logger()
logger.info("Starting ETL pipeline")


def setup_environment(config: Dict[str, Any]) -> None:
    """Set up the environment by ensuring necessary directories exist.

    Args:
        config (Dict[str, Any]): Configuration dictionary containing directory paths.
    """
    directories: List[Union[Path, str]] = [
        config["directory_structure"]["raw_dir"],
        config["directory_structure"]["extracted_dir"],
        config["directory_structure"]["processed_dir"],
    ]
    setup_directories(directories)
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
    download_chunk_size = config.get("download_chunk_size", 1024 * 1024)
    download_and_extract_files(url, raw_file_path, extracted_dir, download_chunk_size)
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


def save_json_chunk(chunk: List[Dict[str, Any]], output_path: Path, chunk_index: int) -> None:
    """Save a chunk of JSON data to a file.

    Args:
        chunk (List[Dict[str, Any]]): The chunk of JSON data.
        output_path (Path): The directory where the chunk will be saved.
        chunk_index (int): The index of the chunk.
    """
    chunk_file = output_path / f"chunk_{chunk_index}.json"
    with chunk_file.open("w", encoding="utf-8") as file:
        json.dump(chunk, file, indent=4)
    logger.info(f"Saved chunk {chunk_index} to {chunk_file}")

def split_json_to_files(input_path: Path, output_dir: Path, chunk_size: int) -> None:
    """Split a large JSON file into smaller chunks.

    Args:
        input_path (Path): Path to the input JSON file.
        output_dir (Path): Directory where the chunks will be saved.
        chunk_size (int): Number of records per chunk.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    with input_path.open("r", encoding="utf-8") as infile:
        chunk = []
        chunk_index = 0
        for record in ijson.items(infile, "item"):
            chunk.append(record)
            if len(chunk) >= chunk_size:
                save_json_chunk(chunk, output_path, chunk_index)
                chunk_index += 1
                chunk = []
        if chunk:
            save_json_chunk(chunk, output_path, chunk_index)


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


def process_json_file(json_file: Path) -> pd.DataFrame:
    """Convert a JSON file (list or line-delimited) into a Pandas DataFrame.

    Args:
        json_file (Path): Path to the JSON file.

    Returns:
        pd.DataFrame: DataFrame containing JSON data.
    """
    all_rows = []
    try:
        with json_file.open("r", encoding="utf-8") as file:
            # Attempt to load as a JSON list
            data = json.load(file)
            if isinstance(data, list):
                all_rows.extend(data)
            else:
                logger.warning(
                    f"Unexpected JSON format in {json_file}. Expected a list."
                )
    except json.JSONDecodeError:
        logger.info(f"Falling back to line-by-line parsing for {json_file}.")
        # Line-by-line parsing for line-delimited JSON
        with json_file.open("r", encoding="utf-8") as file:
            for line in file:
                try:
                    record = json.loads(line)
                    if isinstance(record, dict):
                        all_rows.append(record)
                except json.JSONDecodeError as e:
                    logger.error(f"Skipping invalid JSON line: {e}")

    if not all_rows:
        logger.warning(f"No valid data found in {json_file}")
        return pd.DataFrame()

    return pd.DataFrame(all_rows)


def run_etl_pipeline() -> None:
    """Execute the ETL pipeline."""
    start_time = time.time()
    config = load_all_configs()
    
    try:
        # Load configurations
        config = load_all_configs()

        # Setup directories
        setup_directories(config)

        # Download and extract files
        download_and_extract_files(
            config["data_source"]["url"],
            Path(config["directory_structure"]["raw_dir"]) / config["file_names"]["raw_file"],
            Path(config["directory_structure"]["extracted_dir"]),
            config["download_chunk_size"]
        )

        # Split JSON file into smaller chunks
        input_json_file = get_first_json_file(Path(config["directory_structure"]["extracted_dir"]))
        split_dir = Path(config["directory_structure"]["processed_dir"]) / "chunks"
        split_json_to_files(input_json_file, split_dir, config["chunk_size"])

        # Process entities
        start_index = 1
        for json_file in sorted(split_dir.glob("chunk_*.json")):
            data_records = process_json_file(json_file)
            start_index = process_entities(data_records, config, start_index)

        # Clean processed data
        processed_dir = Path(config["directory_structure"]["processed_dir"])
        cleaned_dir = processed_dir / "cleaned"
        cleaned_dir.mkdir(parents=True, exist_ok=True)
        for entity in config["entities"]:
            entity_name = entity["name"]
            specific_columns = entity.get("specific_columns", [])
            logger.info(f"Starting cleaning for entity: {entity_name}")
            clean_entity_files(
                str(processed_dir / "extracted"),
                str(cleaned_dir),
                entity_name,
                specific_columns,
            )

        elapsed_time = time.time() - start_time
        logger.info(f"ETL pipeline completed in {elapsed_time:.2f} seconds.")
    

    except Exception as e:
        logger.error(f"ETL pipeline failed: {e}")
        raise


if __name__ == "__main__":
    run_etl_pipeline()
