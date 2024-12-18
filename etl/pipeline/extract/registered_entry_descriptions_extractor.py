"""Extractor for Registered Entry Descriptions.

This module defines the `RegisteredEntryDescriptionsExtractor` class, responsible for
extracting and processing descriptions of registered entries from raw company records.
It supports filtering by language and validates data against mappings.

Key Features:
- Language-specific filtering for registered entry descriptions.
- Maps raw language codes to language abbreviations.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for invalid or incomplete data.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class RegisteredEntryDescriptionsExtractor(BaseExtractor):
    """Extractor class for the 'registered_entry_descriptions' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        # Retrieve the language code mapping
        self.language_code_mapping = self.mappings.get_mapping("language_code_mapping")
        if self.lang not in self.language_code_mapping:
            self.logger.error(f"Invalid language code: {self.lang}")
            raise ValueError(f"Invalid language code: {self.lang}")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract registered entry descriptions.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted registered entry description records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            return results  # Skip if no business ID

        for entry in company.get("registeredEntries", []):
            descriptions = entry.get("descriptions", [])
            for desc in descriptions:
                try:
                    # Map raw language code back to language abbreviation
                    raw_language_code = desc.get("languageCode")
                    mapped_lang = next(
                        (
                            key
                            for key, value in self.ensure_dict(
                                self.language_code_mapping
                            ).items()
                            if value == str(raw_language_code)
                        ),
                        None,
                    )

                    if mapped_lang == self.lang:
                        results.append(
                            {
                                "businessId": business_id,
                                "entryType": entry.get("type", ""),
                                "description": desc.get("description", ""),
                            }
                        )
                except Exception as e:
                    self.logger.error(
                        f"Unexpected error while processing description: {e}"
                    )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process registered entry descriptions from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed registered entry descriptions.
        """
        self.logger.info(
            f"Starting extraction for Registered Entry Descriptions. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
