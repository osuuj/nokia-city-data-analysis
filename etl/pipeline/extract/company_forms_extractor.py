"""Extractor for Company Forms.

This module defines the `CompanyFormsExtractor` class, responsible for extracting and
processing data related to company forms from raw company records. It validates data
against mappings and supports language-specific transformations.

Key Features:
- Dynamic mapping resolution for fields like source and language.
- Modular class-based design for reusability in ETL pipelines.
- Comprehensive logging and error handling for skipped or invalid records.
"""

from typing import Any, Dict, List

import pandas as pd

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

        self.source_mapping = self.get_mapping("source_mapping")
        self.language_code_mapping = self.get_mapping("language_code_mapping")

    def process_description(self, descriptions: List[Dict[str, Any]]) -> str:
        """Process the descriptions to extract the relevant business form description.

        Args:
            descriptions (List[Dict[str, Any]]): List of description dictionaries.

        Returns:
            str: The processed business form description.
        """
        lang_code = self.language_code_mapping
        if not lang_code:
            return ""

        for description in descriptions:
            if description.get("languageCode") == lang_code:
                return description.get("description", "")

        return ""

    def process_row(self, row: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract company forms data.

        Args:
            row (Dict[str, Any]): The raw company record.

        Returns:
            List[Dict[str, Any]]: Extracted company forms data.
        """
        results: List[Dict[str, Any]] = []

        business_id = self.get_business_id(row)
        if not business_id:
            return results

        company_forms = row.get("companyForms", [])
        if not isinstance(company_forms, list):
            return results

        for form in company_forms:
            if not isinstance(form, dict):
                continue
            try:
                mapped_source = self.map_value(form.get("source"), self.source_mapping)
                business_form = self.process_description(form.get("descriptions", []))
                results.append(
                    {
                        "businessId": business_id,
                        "businessForm": business_form,
                        "version": form.get("version", 0),
                        "registrationDate": self.parse_date(
                            form.get("registrationDate")
                        ),
                        "endDate": self.parse_date(form.get("endDate")),
                        "source": mapped_source,
                    }
                )
            except Exception as e:
                self.logger.error(f"Error processing form: {form}, error: {e}")
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
        return self.process_data(data)
