"""Extractor for Company Situations.

This module defines the `CompanySituationsExtractor` class, responsible for extracting and
processing data related to company situations from raw company records. It supports language-specific
mappings and ensures data validation.

Key Features:
- Dynamic mapping resolution for fields like type and source.
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
            lang (str): Target language code for mapping (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        # Validate required mappings
        if not self.validate_language("type_mapping"):
            raise ValueError("Invalid language for type_mapping.")
        if not self.validate_language("source_mapping"):
            raise ValueError("Invalid language for source_mapping.")

        # Load mappings
        self.type_mapping = self.mappings.get_mapping("type_mapping", lang)
        self.source_mapping = self.mappings.get_mapping("source_mapping", lang)

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract company situations.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: Extracted company situations data.
        """
        results: List[Dict[str, Any]] = []
        try:
            business_id = self.get_business_id(company)
            if not business_id:
                self.logger.debug("Skipping company without businessId.")
                return results

            for situation in company.get("companySituations", []):
                try:
                    # Map type and source
                    raw_type = situation.get("type", "")
                    mapped_type = self.map_value(raw_type, self.type_mapping)

                    raw_source = situation.get("source", None)
                    mapped_source = self.map_value(raw_source, self.source_mapping)

                    results.append(
                        {
                            "businessId": business_id,
                            "type": mapped_type,
                            "registrationDate": self.parse_date(
                                situation.get("registrationDate")
                            ),
                            "endDate": self.parse_date(situation.get("endDate")),
                            "source": mapped_source,
                        }
                    )
                except Exception as e:
                    self.logger.error(
                        f"Unexpected error while processing situation: {e}"
                    )
        except Exception as e:
            self.logger.error(
                f"Error processing company {company.get('businessId', 'unknown')}: {e}"
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
        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
