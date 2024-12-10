"""
Dynamic Loader

This module provides functionality to dynamically load static mappings 
and configurations for the ETL pipeline. It integrates with the centralized 
`config.py` to retrieve file paths and settings.
"""

import os
import logging
from typing import Dict
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Constants derived from CONFIG
TOIMI_FILES_PATH = CONFIG["config_files"]["toimi_files_path"]
LANGUAGES = CONFIG[
    "languages"
].values()  # Extract language codes (e.g., ["fi", "en", "sv"])
CATEGORIES = CONFIG["codes"]  # Supported TOIMI categories


def load_toimi_mappings(
    base_path: str = TOIMI_FILES_PATH,
) -> Dict[str, Dict[str, Dict[str, str]]]:
    """Loads TOIMI mappings for various languages and categories.

    Args:
        base_path (str): Base directory containing the mapping files.

    Returns:
        Dict[str, Dict[str, Dict[str, str]]]: Nested dictionary containing TOIMI mappings.
        Structure: {category: {language: {code: description}}}.
    """
    all_mappings: Dict[str, Dict[str, Dict[str, str]]] = {
        category: {lang: {} for lang in LANGUAGES} for category in CATEGORIES
    }

    for category in CATEGORIES:
        for lang in LANGUAGES:
            file_path = os.path.join(base_path, f"{category}_{lang}.txt")
            if not os.path.isfile(file_path):
                logger.warning(f"Mapping file not found: {file_path}")
                continue

            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    for line in file:
                        parts = line.strip().split("\t", 1)
                        if len(parts) == 2:
                            code, description = parts
                            all_mappings[category][lang][code] = description
                        else:
                            logger.warning(
                                f"Invalid line format in {file_path}: {line.strip()}"
                            )
            except Exception as e:
                logger.error(f"Error reading file {file_path}: {e}")

    return all_mappings
