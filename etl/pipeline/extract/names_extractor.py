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

        self.name_type_mapping = self.get_mapping("name_type_mapping")
        self.source_mapping = self.get_mapping("source_mapping")

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract name information.

        Args:
            row (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted name records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(row)
        if not business_id:
            self.logger.warning("Skipping company without businessId.")
            return results

        for name in row.get("names", []):
            try:
                mapped_type = self.map_value(
                    name.get("type", ""), self.name_type_mapping
                )
                mapped_source = self.map_value(
                    name.get("source", ""), self.source_mapping
                )

                results.append(
                    {
                        "businessId": business_id,
                        "companyName": name.get("name", ""),
                        "version": name.get("version", 0),
                        "companyType": mapped_type,
                        "registrationDate": self.parse_date(
                            name.get("registrationDate")
                        ),
                        "endDate": self.parse_date(name.get("endDate")),
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
        return self.process_data(data)
