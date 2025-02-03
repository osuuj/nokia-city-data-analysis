"""Extractor for Post Offices.

This module defines the `PostOfficesExtractor` class, responsible for extracting and
processing data related to post offices from raw company records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like source and language.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class PostOfficesExtractor(BaseExtractor):
    """Extractor class for the 'post_offices' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        self.language_code_mapping = self.get_mapping("language_code_mapping")

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract post office information.

        Args:
            row (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: A list of extracted post office records.
        """
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(row)
        if not business_id:
            self.logger.warning("Skipping record with missing businessId.")
            return results

        for address in row.get("addresses", []):
            try:
                post_offices = address.get("postOffices", [])
                target_language_code = self.language_code_mapping

                # Adjust target language code logic
                if target_language_code in ["1", "3"]:
                    target_language_code = "1"
                elif target_language_code == "2":
                    target_language_code = "2"

                for po in post_offices:
                    if po.get("languageCode") == target_language_code:
                        results.append(
                            {
                                "businessId": business_id,
                                "postalCode": address.get("postCode", ""),
                                "city": po.get("city", ""),
                                "municipalityCode": po.get("municipalityCode", ""),
                                "active": po.get("active", True),
                            }
                        )
            except Exception as e:
                self.logger.error(
                    f"Error processing address for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process post office data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed post office data.
        """
        self.logger.info(
            f"Starting extraction for Post Offices. Input rows: {len(data)}"
        )
        return self.process_data(data)
