"""Dynamic Loader and Mappings Manager.

This module provides functionality for dynamically loading and managing static
mappings and configurations required in the ETL pipeline.

Key features include:
- Loading TOIMI mapping files for various languages and categories.
- Managing YAML-based mappings for field-specific configurations.
- Providing utility methods for retrieving and validating mappings.

Integrates with the centralized `config.py` for file paths and language settings.
"""

import logging
from pathlib import Path
from typing import Any, Dict, Optional, Union

import yaml
from etl.config.config_loader import CONFIG

logger = logging.getLogger(__name__)

# Constants derived from CONFIG
TOIMI_FILES_PATH = Path(CONFIG["config_files"]["toimi_files_path"])
LANGUAGES = CONFIG["languages"].values()  # Extract language codes (e.g., ["fi", "en", "sv"])
CATEGORIES = CONFIG["codes"]  # Supported TOIMI categories

# Default YAML mappings key
DEFAULT_MAPPINGS_KEY = "mappings"


class DynamicLoader:
    """Class to dynamically load TOIMI mappings."""

    def __init__(self, base_path: Path = TOIMI_FILES_PATH) -> None:
        """Initialize the DynamicLoader.

        Args:
            base_path (Path): Base path to the TOIMI files.
        """
        self.base_path = base_path

    def load_mapping(self, category: str, language: str) -> Dict[str, Any]:
        """Load a specific TOIMI mapping file.

        Args:
            category (str): The category of the mapping (e.g., "type").
            language (str): The language code (e.g., "fi", "en").

        Returns:
            Dict[str, Any]: The loaded mapping data.

        Raises:
            FileNotFoundError: If the mapping file does not exist.
            yaml.YAMLError: If there is an error parsing the YAML file.
        """
        file_path = self.base_path / f"{category}_{language}.yaml"
        if not file_path.exists():
            raise FileNotFoundError(f"Mapping file not found: {file_path}")

        with file_path.open("r", encoding="utf-8") as file:
            try:
                return yaml.safe_load(file)
            except yaml.YAMLError as e:
                logger.error(f"Error parsing YAML file {file_path}: {e}")
                raise

    def load_toimi_mappings(self) -> Dict[str, Dict[str, Any]]:
        """Load all TOIMI mappings for supported languages and categories.

        Returns:
            Dict[str, Dict[str, Any]]: A dictionary of TOIMI mappings.
        """
        toimi_mappings = {}
        for category in CATEGORIES:
            toimi_mappings[category] = {}
            for language in LANGUAGES:
                try:
                    toimi_mappings[category][language] = self.load_mapping(category, language)
                except FileNotFoundError:
                    logger.warning(f"Mapping file for category '{category}' and language '{language}' not found.")
        return toimi_mappings


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
            yaml.YAMLError: If there is an error parsing the YAML file.
        """
        if not self.mappings_file.exists():
            raise FileNotFoundError(f"Mappings file not found: {self.mappings_file}")
        try:
            with self.mappings_file.open("r", encoding="utf-8") as file:
                data = yaml.safe_load(file) or {}
                mappings = data.get(DEFAULT_MAPPINGS_KEY)
                if not mappings:
                    raise KeyError(f"'{DEFAULT_MAPPINGS_KEY}' not found in {self.mappings_file}")
                logger.info(f"Loaded mappings: {list(mappings.keys())}")
                return mappings
        except yaml.YAMLError as e:
            logger.error(f"Error parsing YAML file {self.mappings_file}: {e}")
            raise

    def get_mapping(self, mapping_name: str, language: Optional[str] = None) -> Union[Dict[str, Any], str]:
        """Retrieve a specific mapping for a given language.

        Args:
            mapping_name (str): The name of the mapping.
            language (Optional[str]): The language code (e.g., 'en', 'fi').

        Returns:
            Union[Dict[str, Any], str]: The requested mapping.

        Raises:
            KeyError: If the mapping or language does not exist.
            TypeError: If the mapping type is unexpected.
        """
        mapping = self.mappings.get(mapping_name)
        if mapping is None:
            raise KeyError(f"Mapping '{mapping_name}' not found in {self.mappings_file}.")

        if isinstance(mapping, dict) and language:
            if language in mapping:
                return mapping[language]
            raise KeyError(f"Language '{language}' not supported for mapping '{mapping_name}'.")

        if isinstance(mapping, (str, dict)):
            return mapping
        raise TypeError(f"Unexpected type for mapping '{mapping_name}': {type(mapping).__name__}")

    def validate_mapping(self, mapping_name: str, language: Optional[str] = None) -> bool:
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

    def validate_language(self, mapping_name: str) -> bool:
        """Validate if a language code exists in the mapping.

        Args:
            mapping_name (str): Name of the mapping to validate.

        Returns:
            bool: True if the language code is valid, False otherwise.
        """
        return mapping_name in self.mappings
