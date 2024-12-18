"""Entity Processing for ETL Pipeline.

This script processes and saves data for various entities defined in the ETL pipeline.
It dynamically resolves extractor classes based on the configuration file and processes
data using entity-specific logic.

Key Features:
- Dynamically resolves and instantiates extractor classes.
- Processes data records for each entity and saves them in chunks.
- Ensures robust error handling and logging.

"""

import gc
import logging
import pandas as pd
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict
from etl.utils.file_system_utils import ensure_directory_exists
from etl.utils.dynamic_imports import import_function
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Global index tracker
entity_index_tracker = defaultdict(int)


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
    df: pd.DataFrame,
    output_base_name: str,
    chunk_size: int,
    entity_name: str,
    start_index: int = 1,
) -> int:
    """Save a DataFrame to multiple CSV files in chunks.

    Args:
        df (pd.DataFrame): The DataFrame to save.
        output_base_name (str): Base name for the output CSV files.
        chunk_size (int): Number of records per chunk.
        entity_name (str): Name of the entity being processed.
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

    for i in range(num_chunks):
        chunk = df.iloc[i * chunk_size : (i + 1) * chunk_size]
        chunk_file_name = output_base_path.with_name(
            f"{output_base_path.stem}_part{start_index + i}.csv"
        )
        
        # Check if file exists and increment index if necessary
        while chunk_file_name.exists():
            start_index += 1
            chunk_file_name = output_base_path.with_name(
                f"{output_base_path.stem}_part{start_index + i}.csv"
            )
        
        try:
            chunk.to_csv(chunk_file_name, index=False, encoding="utf-8")
            if i % 10 == 0:  # Log progress every 10 chunks
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
    """Process and save data for a specific entity with optimized performance."""
    entity_name = entity["name"]
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    try:
        logger.info(f"Processing entity: {entity_name}")
        extractor = get_extractor_instance(entity, lang)

        # Process data in chunks to manage memory usage
        num_chunks = (len(data_records) + chunk_size - 1) // chunk_size
        for i in range(num_chunks):
            chunk_start = i * chunk_size
            chunk_end = min(chunk_start + chunk_size, len(data_records))
            data_chunk = data_records.iloc[chunk_start:chunk_end]

            # Extract data
            extracted_data = extractor.extract(data_chunk)

            if extracted_data.empty or not isinstance(extracted_data, pd.DataFrame):
                logger.warning(f"No valid data extracted for entity '{entity_name}'.")
                continue

            # Save data to CSV
            output_base_name = subfolder_path / entity_name
            save_to_csv_in_chunks(
                extracted_data, str(output_base_name), chunk_size, entity_name, start_index
            )
            start_index += 1  # Increment index per chunk

        logger.info(f"Processing and saving completed for entity: {entity_name}")
        gc.collect()  # Perform garbage collection once per entity
        return start_index
    except Exception as e:
        logger.error(f"Error processing entity '{entity_name}': {e}")
        raise RuntimeError(f"Error processing entity '{entity_name}': {e}")


def process_entities(
    data_records: pd.DataFrame, config: Dict[str, Any], start_index: int = 1
) -> int:
    """Process and save data for all entities with consistent naming."""
    extract_data_path = (
        Path(config["directory_structure"]["processed_dir"]) / "extracted"
    )
    extract_data_path.mkdir(parents=True, exist_ok=True)

    # Local counter for each entity
    entity_counters = {}

    for entity in config["entities"]:
        entity_name = entity["name"]

        # Initialize the counter for the entity
        if entity_name not in entity_counters:
            entity_counters[entity_name] = start_index

        # Process the entity and increment the counter
        entity_start_index = entity_counters[entity_name]
        next_index = process_and_save_entity(
            data_records,
            config["chosen_language"],
            entity,
            str(extract_data_path),
            config["chunk_size"],
            entity_start_index,
        )

        # Update the counter for the next call
        entity_counters[entity_name] = next_index

    logger.info("Entity processing completed.")
    return start_index
