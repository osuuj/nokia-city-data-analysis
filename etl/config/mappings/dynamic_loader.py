"""
Dynamic mappings loader.

This module provides functionality for dynamically loading language-specific
mappings from external files.
"""
import logging

logger = logging.getLogger(__name__)

def load_toimi_mappings(base_path="etl/data/1_raw/mappings"):
    """
    Dynamically load TOIMI mappings for all supported languages.

    :param base_path: Base path where TOIMI mapping files are located.
    :return: A dictionary containing TOIMI mappings for all languages.
    """
    toimi_files = {
        "TOIMI": {"fi": f"{base_path}/TOIMI_fi.txt", "en": f"{base_path}/TOIMI_en.txt", "sv": f"{base_path}/TOIMI_sv.txt"},
    }

    all_mappings = {key: {lang: {} for lang in file_paths.keys()} for key, file_paths in toimi_files.items()}

    for category, file_paths in toimi_files.items():
        for lang, file_path in file_paths.items():
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    for line in file:
                        parts = line.strip().split('\t', 1)
                        if len(parts) == 2:
                            code, description = parts
                            all_mappings[category][lang][str(code)] = description
                logger.info(f"Loaded {category} mappings for {lang} from {file_path}")
            except FileNotFoundError:
                logger.warning(f"File not found: {file_path}")
            except Exception as e:
                logger.error(f"Error loading {category} file for {lang} ({file_path}): {e}")

    return all_mappings
