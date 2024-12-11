"""

Entity Processing Module

This module handles the processing and saving of entity-specific data. It integrates 
extraction functions dynamically, processes records based on language-specific logic, 
and stores the output in chunked CSV files for downstream usage.

Key Features:
- Dynamically resolves entity-specific extractor functions.
- Processes data records and validates extracted results.
- Saves processed data efficiently in manageable chunks.
"""

import logging
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

from etl.utils.chunking_utils import save_to_csv_in_chunks
from etl.utils.extraction_helpers import get_extractor_function
from etl.utils.file_system_utils import ensure_directory_exists

logger = logging.getLogger(__name__)


def process_and_save_entity(
    data_records: List[Dict[str, Any]],
    lang: str,
    entity_name: str,
    extract_data_path: str,
    chunk_size: int,
    entities: List[Dict[str, Any]],
) -> None:
    """Process and save data for a specific entity.

    Args:
        data_records (List[Dict[str, Any]]): List of data records to process.
        lang (str): Language for processing the data.
        entity_name (str): Name of the entity being processed.
        extract_data_path (str): Path to save the extracted data.
        chunk_size (int): Size of chunks to save the data.
        entities (List[Dict[str, Any]]): List of entity configurations.

    Raises:
        RuntimeError: If processing fails for the specified entity.
    """
    subfolder_path = Path(extract_data_path) / entity_name
    ensure_directory_exists(subfolder_path)

    logger.info(f"Starting processing for entity: {entity_name}")

    try:
        # Fetch the extractor function dynamically
        extractor_func = get_extractor_function(entity_name, entities)
        logger.debug(f"Extractor function resolved for {entity_name}: {extractor_func}")

        # Extract data using the extractor function
        extracted_data = extractor_func(data_records, lang)

        # Validate the extracted data
        if not extracted_data or not isinstance(extracted_data, list):
            logger.warning(f"No valid data extracted for entity '{entity_name}'.")
            return

        logger.info(
            f"Extracted {len(extracted_data)} records for entity '{entity_name}'."
        )
        extracted_df = pd.DataFrame(extracted_data)

        # Save the extracted data in chunks
        output_base_name = subfolder_path / entity_name
        save_to_csv_in_chunks(extracted_df, str(output_base_name), chunk_size)
        logger.info(f"Processing and saving completed for entity: {entity_name}")
    except Exception as e:
        logger.error(f"Error processing entity '{entity_name}': {e}")
        raise RuntimeError(f"Error processing entity '{entity_name}': {e}")
