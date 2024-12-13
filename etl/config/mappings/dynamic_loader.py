"""Dynamic Loader and Mappings Manager.

This module provides functionality for dynamically loading and managing static 
mappings and configurations required in the ETL pipeline. 

Key features include:
- Loading TOIMI mapping files for various languages and categories.
- Managing YAML-based mappings for field-specific configurations.
- Providing utility methods for retrieving and validating mappings.

Integrates with the centralized `config.py` for file paths and language settings.
"""

import yaml
import logging

from pathlib import Path
from typing import Any, Dict, Optional, Union
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Constants derived from CONFIG

TOIMI_FILES_PATH = Path(CONFIG["config_files"]["toimi_files_path"])
LANGUAGES = CONFIG[
    "languages"
].values()  # Extract language codes (e.g., ["fi", "en", "sv"])
CATEGORIES = CONFIG["codes"]  # Supported TOIMI categories

# Default YAML mappings key
DEFAULT_MAPPINGS_KEY = "mappings"


class DynamicLoader:
    """Class to dynamically load TOIMI mappings."""

    def __init__(self, base_path: Path = TOIMI_FILES_PATH) -> None:
        """Initialize the DynamicLoader.

        Args:
            base_path (Path): Base directory containing TOIMI mapping files.
        """
        self.base_path = base_path

    def load_toimi_mappings(self) -> Dict[str, Dict[str, Dict[str, str]]]:
        """Loads TOIMI mappings for various languages and categories.

        Returns:
            Dict[str, Dict[str, Dict[str, str]]]: Nested dictionary containing TOIMI mappings.
            Structure: {category: {language: {code: description}}}.
        """
        all_mappings: Dict[str, Dict[str, Dict[str, str]]] = {
            category: {lang: {} for lang in LANGUAGES} for category in CATEGORIES
        }

        for category in CATEGORIES:
            for lang in LANGUAGES:
                file_path = self.base_path / f"{category}_{lang}.txt"
                if not file_path.is_file():
                    logger.warning(f"Mapping file not found: {file_path}")
                    continue

                try:
                    with file_path.open("r", encoding="utf-8") as file:
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


class Mappings:
    """Class to manage and access YAML-based mappings."""

    def __init__(self, mappings_file: str) -> None:
        """Initialize the Mappings class.

        Args:
            mappings_file (str): Path to the YAML mappings file.
        """
        self.mappings_file: Path = Path(mappings_file).resolve()
        self.mappings: Dict[str, Any] = self._load_mappings()

    def _load_mappings(self) -> Dict[str, Any]:
        """Load mappings from the YAML file.

        Returns:
            Dict[str, Any]: Parsed mappings data.

        Raises:
            FileNotFoundError: If the mappings file does not exist.
            KeyError: If the required mappings key is missing in the YAML file.
        """
        if not self.mappings_file.exists():
            raise FileNotFoundError(f"Mappings file not found: {self.mappings_file}")
        try:
            with self.mappings_file.open("r", encoding="utf-8") as file:
                data = yaml.safe_load(file) or {}
                mappings = data.get(DEFAULT_MAPPINGS_KEY)
                if not mappings:
                    raise KeyError(
                        f"'{DEFAULT_MAPPINGS_KEY}' not found in {self.mappings_file}"
                    )
                logger.info(f"Loaded mappings: {list(mappings.keys())}")
                return mappings
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML file {self.mappings_file}: {e}")
            raise

    def get_mapping(
        self, mapping_name: str, language: Optional[str] = None
    ) -> Union[Dict[str, Any], str]:
        """Retrieve a specific mapping for a given language.

        Args:
            mapping_name (str): The name of the mapping.
            language (Optional[str]): The language code (e.g., 'en', 'fi').

        Returns:
            Union[Dict[str, Any], str]: The requested mapping.

        Raises:
            KeyError: If the mapping or language is not found.
            TypeError: If the mapping type is unexpected.
        """
        mapping = self.mappings.get(mapping_name)
        if mapping is None:
            raise KeyError(
                f"Mapping '{mapping_name}' not found in {self.mappings_file}."
            )

        if isinstance(mapping, dict) and language:
            if language in mapping:
                return mapping[language]
            raise KeyError(
                f"Language '{language}' not supported for mapping '{mapping_name}'."
            )

        if isinstance(mapping, (str, dict)):
            return mapping
        raise TypeError(
            f"Unexpected type for mapping '{mapping_name}': {type(mapping).__name__}"
        )

    def validate_mapping(
        self, mapping_name: str, language: Optional[str] = None
    ) -> bool:
        """Validate a mapping for a given language and mapping name.

        Args:
            mapping_name (str): Name of the mapping to validate.
            language (Optional[str]): Language abbreviation (e.g., "fi", "en", "sv").

        Returns:
            bool: True if the mapping is valid, False otherwise.

        Raises:
            KeyError: If the mapping or language does not exist.
        """
        try:
            self.get_mapping(mapping_name, language)
            return True
        except KeyError:
            return False
