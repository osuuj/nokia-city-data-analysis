"""Mappings loader.

This module provides utilities to load and retrieve static mappings
from a centralized YAML file.
"""

import logging
import os
from typing import Any, Dict, Union

import yaml

logger = logging.getLogger(__name__)

# Constants
DEFAULT_MAPPINGS_KEY = "mappings"


class Mappings:
    """Class to manage mappings."""

    def __init__(self, mappings_file: str):
        """Initialize the Mappings class.

        Args:
            mappings_file (str): Path to the mappings file.
        """
        self.mappings_file = mappings_file
        self.mappings = self._load_mappings()

    def _load_mappings(self) -> Dict[str, Any]:
        """Load mappings from the YAML file.

        Returns:
            Dict[str, Any]: Parsed mappings data.

        Raises:
            FileNotFoundError: If the mappings file does not exist.
        """
        if not os.path.exists(self.mappings_file):
            raise FileNotFoundError(f"Mappings file not found: {self.mappings_file}")
        with open(self.mappings_file, "r", encoding="utf-8") as file:
            mappings = yaml.safe_load(file).get(DEFAULT_MAPPINGS_KEY, {})
            logger.info(f"Loaded mappings: {list(mappings.keys())}")
            return mappings

    def get_mapping(
        self, mapping_name: str, language: Union[str, None] = None
    ) -> Union[Dict[str, Any], Any]:
        """Retrieve a specific mapping for a given language.

        Args:
            mapping_name (str): The name of the mapping.
            language (Union[str, None]): The language code (e.g., 'en', 'fi').

        Returns:
            Union[Dict[str, Any], Any]: The requested mapping.

        Raises:
            KeyError: If the mapping or language is not found.
        """
        mapping = self.mappings.get(mapping_name)
        if not mapping:
            raise KeyError(f"Mapping {mapping_name} not found in {self.mappings_file}.")

        # If the mapping is not language-specific, return it directly
        if not isinstance(mapping, dict):
            return mapping

        # Handle language-specific mappings
        if language and language in mapping:
            return mapping[language]
        elif language:
            raise KeyError(
                f"Language {language} not supported for mapping {mapping_name}."
            )

        return mapping

    def validate_mapping(
        self, mapping_name: str, language: Union[str, None] = None
    ) -> bool:
        """Validate a mapping for a given language and mapping name.

        Args:
            mapping_name (str): Name of the mapping to validate.
            language (Union[str, None]): Language abbreviation (e.g., "fi", "en", "sv").

        Returns:
            bool: True if the mapping is valid, False otherwise.

        Raises:
            KeyError: If the mapping or language does not exist.
        """
        # Retrieve the mapping (or None if not found)
        mapping = self.get_mapping(mapping_name, language)

        # If mapping is not found, raise a KeyError
        if mapping is None:
            raise KeyError(
                f"Mapping '{mapping_name}' not found for language '{language}'."
            )

        # If mapping is found, return True (valid)
        return True
