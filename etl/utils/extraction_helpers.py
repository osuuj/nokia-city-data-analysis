"""
Helpers for Entity-Specific Data Extraction

This module provides utilities for resolving extractor functions
for specific entities based on configuration. It integrates with
dynamic imports to retrieve the appropriate function for each entity.

Key Features:
- Resolves extractor function paths dynamically based on entity configuration.
- Supports modularity and scalability for entity-specific data processing.
"""

import logging
from typing import Any, Callable, Dict, List

from etl.utils.dynamic_imports import import_function

logger = logging.getLogger(__name__)


def get_extractor_function(
    entity_name: str, entities: List[Dict[str, Any]]
) -> Callable:
    """Resolve the extractor function for a given entity.

    Args:
        entity_name (str): The name of the entity to process.
        entities (List[Dict[str, Any]]): List of dictionaries, where each dictionary
            represents an entity configuration with fields like 'name' and 'extractor'.

    Returns:
        Callable: The dynamically resolved extractor function.

    Raises:
        ValueError: If no extractor function is found for the specified entity.
        ImportError: If the resolved extractor function cannot be imported.
    """
    if not entities:
        logger.warning("The entities list is empty. Unable to resolve extractor.")
        raise ValueError("Entities list is empty.")

    func_path = next(
        (
            entity.get("extractor")
            for entity in entities
            if entity["name"] == entity_name
        ),
        None,
    )

    if not func_path:
        logger.error(f"No extractor function found for entity: {entity_name}")
        raise ValueError(f"No extractor function found for entity: {entity_name}")

    logger.info(
        f"Extractor function path resolved for entity '{entity_name}': {func_path}"
    )

    try:
        # Dynamically import the function
        return import_function(func_path)
    except ImportError as e:
        logger.error(
            f"Failed to import extractor function for entity '{entity_name}': {e}"
        )
        raise ImportError(
            f"Error importing extractor function for {entity_name}"
        ) from e
