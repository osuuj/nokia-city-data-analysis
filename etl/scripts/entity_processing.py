import logging
import pandas as pd
import time
import importlib

from pathlib import Path
from typing import Any, Callable, Dict, List
from etl.utils.file_system_utils import ensure_directory_exists
from etl.pipeline.extract.base_extractor import BaseExtractor
from etl.pipeline.extract.post_offices_extractor import PostOfficesExtractor
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Registry of entity-specific extractor classes
EXTRACTOR_CLASSES = {
    "post_offices": PostOfficesExtractor,
    # Add other extractors here
}


def get_extractor_instance(
    entity_name: str, mappings_file: str, lang: str
) -> BaseExtractor:
    """Resolve and instantiate the extractor class for a given entity."""
    extractor_cls = EXTRACTOR_CLASSES.get(entity_name)
    if not extractor_cls:
        raise ValueError(f"Extractor class not found for entity: {entity_name}")
    return extractor_cls(mappings_file, lang)


def save_to_csv_in_chunks(
    df: pd.DataFrame, output_base_name: str, chunk_size: int, start_index: int = 1
) -> int:
    """Save a DataFrame to multiple CSV files in chunks."""
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
    entity_name: str,
    extract_data_path: str,
    chunk_size: int,
    start_index: int = 1,
) -> int:
    """Process and save data for a specific entity."""
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    try:
        # Get the mappings file dynamically from CONFIG
        mappings_file = CONFIG["config_files"]["mappings_file"]
        logger.debug(
            f"Processing entity: {entity_name} with data sample: {data_records.head(5).to_dict(orient='records')}"
        )
        extractor = get_extractor_instance(entity_name, mappings_file, lang)
        logger.info(f"Resolved extractor: {extractor.__class__.__name__}")
        extracted_data = extractor.extract(data_records)

        # Validate and save the data
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
    """Process and save data for each entity."""
    extract_data_path = (
        Path(config["directory_structure"]["processed_dir"]) / "extracted"
    )
    extract_data_path.mkdir(parents=True, exist_ok=True)

    start_index = 1
    for entity in config["entities"]:
        entity_name = entity["name"]
        lang = config["chosen_language"]
        start_index = process_and_save_entity(
            data_records,
            lang,
            entity_name,
            str(extract_data_path),
            config["chunk_size"],
            start_index,
        )
    logger.info("Entity processing completed.")
