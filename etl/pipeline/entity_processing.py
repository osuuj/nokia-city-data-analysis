"""This script processes JSON files for various entities, extracts relevant data using specified extractors, and saves the extracted data to CSV files. Each entity's data is saved to a separate CSV file.

Functions:
    get_extractor_instance: Dynamically resolve and instantiate the extractor class for a given entity.
    save_to_csv: Save a DataFrame to a CSV file, appending if the file already exists.
    process_and_save_entity: Process and save data for a specific entity with optimized performance.
    process_entities: Process and save data for all entities with consistent naming.
"""

import gc
import logging
from collections import defaultdict
from pathlib import Path
from typing import Any, DefaultDict, Dict

import pandas as pd

from etl.config.config_loader import CONFIG
from etl.utils.dynamic_imports import import_function
from etl.utils.file_system_utils import ensure_directory_exists

logger = logging.getLogger(__name__)

# Type annotation for entity_index_tracker
entity_index_tracker: DefaultDict[str, int] = defaultdict(int)


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


def process_and_save_entity(
    data_records: pd.DataFrame,
    lang: str,
    entity: Dict[str, Any],
    extract_data_path: str,
) -> None:
    """Process and save data for a specific entity with optimized performance.

    Args:
        data_records (pd.DataFrame): DataFrame containing data records to process.
        lang (str): The target language for processing.
        entity (Dict[str, Any]): Entity configuration containing the extractor path.
        extract_data_path (str): Path to the directory where extracted data will be saved.

    Raises:
        RuntimeError: If an error occurs during the processing of the entity.
    """
    entity_name = entity["name"]
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    try:
        logger.info(f"Processing entity: {entity_name}")
        extractor = get_extractor_instance(entity, lang)

        # Extract data
        extracted_data = extractor.extract(data_records)

        if extracted_data.empty or not isinstance(extracted_data, pd.DataFrame):
            logger.warning(f"No valid data extracted for entity '{entity_name}'.")
            return

        # Save data to CSV
        output_file = subfolder_path / f"{entity_name}.csv"
        save_to_csv(extracted_data, str(output_file))

        logger.info(f"Processing and saving completed for entity: {entity_name}")
        gc.collect()  # Perform garbage collection once per entity
    except Exception as e:
        logger.error(f"Error processing entity '{entity_name}': {e}")
        raise RuntimeError(f"Error processing entity '{entity_name}': {e}")


def process_entities(data_records: pd.DataFrame, config: Dict[str, Any]) -> None:
    """Process and save data for all entities with consistent naming.

    Args:
        data_records (pd.DataFrame): DataFrame containing data records to process.
        config (Dict[str, Any]): Configuration dictionary containing entity and directory information.
    """
    extract_data_path = (
        Path(config["directory_structure"]["processed_dir"]) / "extracted"
    )
    extract_data_path.mkdir(parents=True, exist_ok=True)

    for entity in config["entities"]:
        process_and_save_entity(
            data_records,
            config["chosen_language"],
            entity,
            str(extract_data_path),
        )

    logger.info("Entity processing completed.")
