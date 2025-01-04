from typing import Any, Dict, List

import pandas as pd

from etl.config.mappings.dynamic_loader import DynamicLoader
from etl.pipeline.extract.base_extractor import BaseExtractor


class RegisteredEntriesExtractor(BaseExtractor):
    """Extractor class for the 'registered_entries' entity."""

    def __init__(self, mappings_file: str, lang: str):
        """Initialize the extractor with mappings and language preferences."""
        super().__init__(mappings_file, lang)
        self.dynamic_loader = DynamicLoader()
        self.register_mapping = self.get_mapping("register_mapping")
        self.authority_mapping = self.get_mapping("authority_mapping")
        self.rek_kdi_mapping = self.get_mapping("rek_kdi_mapping")

    def process_row(self, company: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process a single company record to extract registered entry information."""
        results: List[Dict[str, Any]] = []
        business_id = self.get_business_id(company)
        if not business_id:
            self.logger.warning("Skipping company without businessId.")
            return results

        for entry in company.get("registeredEntries", []):
            try:
                mapped_register = self.map_value(
                    entry.get("register"), self.register_mapping
                )
                mapped_authority = self.map_value(
                    entry.get("authority"), self.authority_mapping
                )
                mapped_type = self.map_value(entry.get("type"), self.rek_kdi_mapping)

                results.append(
                    {
                        "businessId": business_id,
                        "registrationStatusCode": mapped_type,
                        "registrationDate": self.parse_date(
                            entry.get("registrationDate")
                        ),
                        "endDate": self.parse_date(entry.get("endDate")),
                        "register": mapped_register,
                        "authority": mapped_authority,
                    }
                )
            except Exception as e:
                self.logger.error(
                    f"Unexpected error while processing registered entry for businessId '{business_id}': {e}"
                )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        """Extract and process registered entry data from raw input."""
        self.logger.info(
            f"Starting extraction for Registered Entries. Input rows: {len(data)}"
        )
        return self.process_data(data)
