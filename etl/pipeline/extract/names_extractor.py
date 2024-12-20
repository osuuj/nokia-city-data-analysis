"""Extractor for Company Names Data.

This module defines the `NamesExtractor` class, responsible for extracting and
processing company name data from raw company records. It validates data against
mappings and supports language-specific filtering.

Key Features:
- Maps name types and sources using configurable mappings.
- Handles multilingual data processing.
- Includes robust error handling and logging for incomplete data.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class NamesExtractor(BaseExtractor):
    """Extractor class for the 'names' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid.
        """
        super().__init__(mappings_file, lang)

        # Validate that required mappings exist for the language
        if not self.validate_language(
            "name_type_mapping"
        ) or not self.validate_language("source_mapping"):
            raise ValueError(f"Invalid language code for the required mappings: {lang}")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract name information.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted name records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            self.logger.debug("Skipping company without businessId.")
            return results  # Skip if no business ID

        # Extract names from the company record
        for name in company.get("names", []):
            try:
                # Map type and source
                mapped_type = self.map_value(
                    name.get("type", ""),
                    self.mappings.get_mapping("name_type_mapping", self.lang),
                )
                mapped_source = self.map_value(
                    name.get("source", ""),
                    self.mappings.get_mapping("source_mapping", self.lang),
                )

                results.append(
                    {
                        "businessId": business_id,
                        "name": name.get("name", ""),
                        "type": mapped_type,
                        "registrationDate": name.get("registrationDate", ""),
                        "endDate": name.get("endDate", ""),
                        "version": name.get("version", 0),
                        "source": mapped_source,
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Error processing name for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process company names from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed company names data.
        """
        self.logger.info(
            f"Starting extraction for Company Names. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
