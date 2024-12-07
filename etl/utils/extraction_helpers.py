"""
Helpers for entity-specific data extraction.

This module provides utilities for resolving extractor functions
for specific entities based on configuration. It integrates with
dynamic imports to retrieve the appropriate function for each entity.
"""

import logging

from etl.utils.dynamic_imports import import_function

logger = logging.getLogger(__name__)


def get_extractor_function(entity_name: str, entities: list):
    """
    Get the extractor function for a given entity from a list of entities.
    :param entity_name: Name of the entity.
    :param entities: List of entity configurations.
    :return: The extractor function.
    """
    func_path = None
    for entity in entities:
        if entity["name"] == entity_name:
            func_path = entity.get("extractor")
            break

    if not func_path:
        logger.error(f"No extractor function found for entity: {entity_name}")
        raise ValueError(f"No extractor function found for entity: {entity_name}")

    logger.info(
        f"Extractor function path resolved for entity {entity_name}: {func_path}"
    )
    return import_function(func_path)
