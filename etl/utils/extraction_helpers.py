"""Helpers for entity-specific data extraction.

This module provides utilities for resolving extractor functions
for specific entities based on configuration. It integrates with
dynamic imports to retrieve the appropriate function for each entity.
"""

import logging
from typing import Any, Callable, Dict, List

from etl.utils.dynamic_imports import import_function

logger = logging.getLogger(__name__)


def get_extractor_function(
    entity_name: str, entities: List[Dict[str, Any]]
) -> Callable:
    """Get the extractor function for a given entity from a list of entities.

    Args:
        entity_name (str): Name of the entity.
        entities (List[Dict[str, Any]]): List of entity configurations.

    Returns:
        Callable: The resolved extractor function.

    Raises:
        ValueError: If no extractor function is found for the specified entity.
    """
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

    # Dynamically import the function
    return import_function(func_path)
