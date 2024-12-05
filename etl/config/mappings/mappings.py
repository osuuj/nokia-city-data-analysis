"""
Mappings loader.

This module provides utilities to load and retrieve static mappings
from a centralized YAML file.
"""
import os
import yaml
import logging
logger = logging.getLogger(__name__)


class Mappings:
    """Class to manage mappings."""
    def __init__(self, mappings_file):
        self.mappings_file = mappings_file
        self.mappings = self._load_mappings()

    def _load_mappings(self):
        if not os.path.exists(self.mappings_file):
            raise FileNotFoundError(f"Mappings file not found: {self.mappings_file}")
        with open(self.mappings_file, 'r', encoding='utf-8') as file:
            mappings = yaml.safe_load(file).get('mappings', {})
            logger.info(f"Loaded mappings: {list(mappings.keys())}")
            return mappings

    def get_mapping(self, mapping_name, language=None):
        """
        Retrieve a specific mapping by name and optional language.

        :param mapping_name: The name of the mapping to retrieve.
        :param language: Optional language to filter the mapping (e.g., 'fi', 'en').
        :return: The requested mapping, filtered by language if provided.
        """
        mapping = self.mappings.get(mapping_name)
        if not mapping:
            raise KeyError(f"Mapping {mapping_name} not found in {self.mappings_file}.")

        # If the mapping is not language-specific, return it directly
        if not isinstance(mapping, dict):
            return mapping

        # Otherwise, handle language-specific mappings
        if language and language in mapping:
            return mapping[language]
        elif language:
            raise KeyError(f"Language {language} not supported for mapping {mapping_name}.")

        return mapping

    def validate_mapping(self, mapping_name, language=None):
        """
        Validate that a mapping exists for the given name and language.

        :param mapping_name: The name of the mapping to validate.
        :param language: Optional language to validate.
        :return: True if valid, raises KeyError otherwise.
        """
        mapping = self.get_mapping(mapping_name, language)
        if mapping is None:
            raise KeyError(f"Mapping {mapping_name} not found in the file.")
        if language and mapping is None:
            raise KeyError(f"Mapping {mapping_name} does not support language {language}.")
        return True
    
