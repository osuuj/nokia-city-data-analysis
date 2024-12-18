"""Extractor for Business Line Descriptions.

This module defines the `BusinessLineDescriptionsExtractor` class, responsible for extracting
and processing data related to business line descriptions from raw company records. It
validates data against language-specific mappings and supports reverse language code resolution.

Key Features:
- Language-specific filtering and reverse mapping for language codes.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

from etl.pipeline.extract.base_extractor import BaseExtractor


class BusinessLineDescriptionsExtractor(BaseExtractor):
    """Extractor class for the 'business_line_descriptions' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences.

        Args:
            mappings_file (str): Path to the mappings YAML file.
            lang (str): Target language code for filtering (e.g., 'en', 'fi', 'sv').

        Raises:
            ValueError: If the language code is invalid for required mappings.
        """
        super().__init__(mappings_file, lang)

        # Validate required mappings
        if not self.validate_language("language_code_mapping"):
            raise ValueError("Invalid language for language_code_mapping.")

        # Load mappings
        self.language_code_mapping = self.mappings.get_mapping("language_code_mapping")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract business line descriptions.

        Args:
            company (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: Extracted business line description records.
        """
        results: List[Dict[str, Any]] = []
        try:
            business_id = self.get_business_id(company)
            if not business_id:
                self.logger.debug("Skipping company without businessId.")
                return results

            main_business_line = company.get("mainBusinessLine", {})
            if not main_business_line:
                self.logger.debug(
                    f"No mainBusinessLine found for businessId: {business_id}"
                )
                return results

            descriptions = main_business_line.get("descriptions", [])
            for desc in descriptions:
                try:
                    # Reverse mapping: Convert numeric code back to language abbreviation
                    raw_language_code = desc.get("languageCode")
                    mapped_lang = next(
                        (
                            key
                            for key, value in self.language_code_mapping.items()
                            if value == str(raw_language_code)
                        ),
                        None,
                    )

                    # Append data if the language matches
                    if mapped_lang == self.lang:
                        results.append(
                            {
                                "businessId": business_id,
                                "languageCode": mapped_lang,
                                "description": desc.get("description", ""),
                            }
                        )
                except KeyError as e:
                    self.logger.error(f"Skipping record due to missing key: {e}")
                except Exception as e:
                    self.logger.error(
                        f"Unexpected error while processing description: {e}"
                    )
        except Exception as e:
            self.logger.error(
                f"Error processing company {company.get('businessId', 'unknown')}: {e}"
            )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process business line descriptions from raw input.

        Args:
            data (pd.DataFrame): DataFrame containing raw company records.

        Returns:
            pd.DataFrame: Extracted and processed business line descriptions.
        """
        self.logger.info(
            f"Starting extraction for Business Line Descriptions. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")

        # Use the modularized process_data method from BaseExtractor
        return self.process_data(data)
