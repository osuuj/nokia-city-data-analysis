"""Extractor for Company Situations.

This module defines the `CompanySituationsExtractor` class, responsible for extracting and
processing data related to company situations from raw company records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like source and language.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class CompanySituationsExtractor(BaseExtractor):
    """Extractor class for the 'company_situations' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        self.type_mapping = self.get_mapping("type_mapping")
        self.source_mapping = self.get_mapping("source_mapping")

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract company situations.

        Args:
            row (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: Extracted company situations data.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(row)
        if not business_id:
            self.logger.warning("Skipping record with missing businessId.")
            return results

        for situation in row.get("companySituations", []):
            try:
                mapped_type = self.map_value(situation.get("type"), self.type_mapping)
                mapped_source = self.map_value(
                    situation.get("source"), self.source_mapping
                )

                results.append(
                    {
                        "businessId": business_id,
                        "type": mapped_type,
                        "registrationDate": self.parse_date(
                            situation.get("registrationDate")
                        ),
                        "source": mapped_source,
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Error processing situation for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process company situations from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed company situations data.
        """
        self.logger.info(
            f"Starting extraction for Company Situations. Input rows: {len(data)}"
        )
        return self.process_data(data)
