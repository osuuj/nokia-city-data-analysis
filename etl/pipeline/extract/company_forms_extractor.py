"""Extractor for Company Forms.

This module defines the `CompanyFormsExtractor` class, responsible for extracting and
processing data related to company forms from raw company records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like source and language.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

import pandas as pd
from typing import Dict, List, Any
from etl.pipeline.extract.base_extractor import BaseExtractor


class CompanyFormsExtractor(BaseExtractor):
    """Extractor class for the 'company_forms' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        # Validate language for required mappings
        if not self.validate_language("source_mapping"):
            raise ValueError("Invalid language for source_mapping.")

        # Load mappings
        self.source_mapping = self.mappings.get_mapping("source_mapping")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract company forms data.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: Extracted company forms data.
        """
        results: List[Dict[str, Any]] = []
        try:
            business_id = self.get_business_id(company)
            if not business_id:
                self.logger.debug("Skipping company without businessId.")
                return results

            for form in company.get("companyForms", []):
                try:
                    results.append(
                        {
                            "businessId": business_id,
                            "type": form.get("type", ""),
                            "registrationDate": self.parse_date(
                                form.get("registrationDate")
                            ),
                            "endDate": self.parse_date(form.get("endDate")),
                            "version": form.get("version", 0),
                            "source": self.map_value(
                                form.get("source", None), self.source_mapping
                            ),
                        }
                    )
                except Exception as e:
                    self.logger.error(
                        f"Unexpected error while processing company form: {e}"
                    )
        except Exception as e:
            self.logger.error(
                f"Error processing company {company.get('businessId', 'unknown')}: {e}"
            )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process company forms data from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed company forms data.
        """
        self.logger.info(
            f"Starting extraction for Company Forms. Input rows: {len(data)}"
        )
        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
