"""Entity Processing for ETL Pipeline.

This script processes and saves data for various entities defined in the ETL pipeline.
It dynamically resolves extractor classes based on the configuration file and processes
data using entity-specific logic.

Key Features:
- Dynamically resolves and instantiates extractor classes.
- Processes data records for each entity and saves them in chunks.
- Ensures robust error handling and logging.

"""

import logging
import pandas as pd
import time
from pathlib import Path
from typing import Any, Dict
from etl.utils.file_system_utils import ensure_directory_exists
from etl.utils.dynamic_imports import import_function
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)


def get_extractor_instance(entity: Dict[str, Any], lang: str) -> Any:
    """Dynamically resolve and instantiate the extractor class for a given entity.

    Args:
        entity (Dict[str, Any]): Entity configuration containing the extractor path.
        lang (str): The target language for processing.

    Returns:
        Any: An instance of the resolved extractor class.

    Raises:
        ValueError: If the extractor class cannot be resolved or instantiated.
    """
    try:
        extractor_cls = import_function(entity["extractor"])
        mappings_file = CONFIG["config_files"]["mappings_file"]
        return extractor_cls(mappings_file, lang)
    except Exception as e:
        logger.error(f"Failed to resolve extractor for entity '{entity['name']}': {e}")
        raise ValueError(f"Error resolving extractor for entity '{entity['name']}'")


def save_to_csv_in_chunks(
    df: pd.DataFrame, output_base_name: str, chunk_size: int, start_index: int = 1
) -> int:
    """Save a DataFrame to multiple CSV files in chunks.

    Args:
        df (pd.DataFrame): The DataFrame to save.
        output_base_name (str): Base name for the output CSV files.
        chunk_size (int): Number of records per chunk.
        start_index (int): Starting index for naming chunk files.

    Returns:
        int: The next starting index for subsequent chunks.
    """
    if chunk_size <= 0:
        raise ValueError("Chunk size must be a positive integer.")

    num_chunks = (len(df) + chunk_size - 1) // chunk_size
    logger.info(
        f"Saving DataFrame to {num_chunks} CSV files with chunk size {chunk_size}"
    )

    output_base_path = Path(output_base_name)
    timestamp = int(time.time())

    for i in range(num_chunks):
        chunk = df.iloc[i * chunk_size : (i + 1) * chunk_size]
        chunk_file_name = output_base_path.with_name(
            f"{output_base_path.stem}_part{start_index + i}_{timestamp}.csv"
        )
        try:
            chunk.to_csv(chunk_file_name, index=False, encoding="utf-8")
            logger.info(f"Saved chunk {start_index + i} to {chunk_file_name}")
        except Exception as e:
            logger.error(
                f"Error writing chunk {start_index + i} to {chunk_file_name}: {e}"
            )

    return start_index + num_chunks


def process_and_save_entity(
    data_records: pd.DataFrame,
    lang: str,
    entity: Dict[str, Any],
    extract_data_path: str,
    chunk_size: int,
    start_index: int = 1,
) -> int:
    """Process and save data for a specific entity.

    Args:
        data_records (pd.DataFrame): Data records to process.
        lang (str): Target language for processing.
        entity (Dict[str, Any]): Entity configuration.
        extract_data_path (str): Path to save the processed data.
        chunk_size (int): Number of records per chunk.
        start_index (int): Starting index for naming chunk files.

    Returns:
        int: The next starting index for subsequent chunks.

    Raises:
        RuntimeError: If processing the entity fails.
    """
    entity_name = entity["name"]
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    try:
        logger.debug(
            f"Processing entity: {entity_name} with data sample: {data_records.head(5).to_dict(orient='records')}"
        )
        extractor = get_extractor_instance(entity, lang)
        logger.info(f"Resolved extractor: {extractor.__class__.__name__}")
        extracted_data = extractor.extract(data_records)

        if extracted_data.empty or not isinstance(extracted_data, pd.DataFrame):
            logger.warning(f"No valid data extracted for entity '{entity_name}'.")
            return start_index

        output_base_name = subfolder_path / entity_name
        next_index = save_to_csv_in_chunks(
            extracted_data, str(output_base_name), chunk_size, start_index
        )
        logger.info(f"Processing and saving completed for entity: {entity_name}")
        return next_index
    except Exception as e:
        logger.error(f"Error processing entity '{entity_name}': {e}")
        raise RuntimeError(f"Error processing entity '{entity_name}': {e}")


def process_entities(data_records: pd.DataFrame, config: Dict[str, Any]) -> None:
    """Process and save data for all entities.

    Args:
        data_records (pd.DataFrame): Data records to process.
        config (Dict[str, Any]): ETL pipeline configuration.
    """
    extract_data_path = (
        Path(config["directory_structure"]["processed_dir"]) / "extracted"
    )
    extract_data_path.mkdir(parents=True, exist_ok=True)

    start_index = 1
    for entity in config["entities"]:
        start_index = process_and_save_entity(
            data_records,
            config["chosen_language"],
            entity,
            str(extract_data_path),
            config["chunk_size"],
            start_index,
        )
    logger.info("Entity processing completed.")
