import pandas as pd
from typing import Dict, List, Any
from etl.pipeline.extract.base_extractor import BaseExtractor


class PostOfficesExtractor(BaseExtractor):
    """Extractor for Post Office entity."""

    def __init__(self, mappings_file: str, lang: str):
        super().__init__(mappings_file, lang)

        # Retrieve the language code from the mappings
        post_office_language_code = self.mappings.get_mapping(
            "post_office_language_code"
        )
        self.lang_code = post_office_language_code.get(lang)

        if not self.lang_code:
            self.logger.error(f"Invalid language code: {lang}")
            raise ValueError(f"Invalid language code: {lang}")

    def process_row(self, company: dict) -> List[dict]:
        results = []
        try:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                self.logger.debug("Skipping company without businessId.")
                return results  # Skip processing if no businessId

            # Proceed with further processing
            addresses = company.get("addresses", [])
            if not addresses:
                self.logger.debug(f"No addresses found for businessId {business_id}")
                return results

            for address in addresses:
                post_offices = address.get("postOffices", [])
                for post_office in post_offices:
                    # Check language code match
                    language_code = str(post_office.get("languageCode"))
                    if language_code == self.lang_code:
                        results.append(
                            {
                                "businessId": business_id,
                                "postCode": post_office.get("postCode", ""),
                                "city": post_office.get("city", ""),
                                "active": post_office.get("active", False),
                                "languageCode": self.lang,  # Store the language string
                                "municipalityCode": post_office.get(
                                    "municipalityCode", ""
                                ),
                            }
                        )
        except Exception as e:
            self.logger.error(
                f"Error processing row {company.get('businessId', 'unknown')}: {e}"
            )
        return results

    def extract(self, data: pd.DataFrame) -> pd.DataFrame:
        self.logger.info(
            f"Starting extraction for Post Offices. Input rows: {len(data)}"
        )
        if not data.empty:
            self.logger.debug(f"Sample input data: {data.head(5).to_dict()}")
        results: List[Dict[str, Any]] = []
        for index, row in data.iterrows():
            try:
                row_dict = row.to_dict()
                self.logger.debug(f"Processing row: {row_dict}")
                results.extend(self.process_row(row_dict))
            except Exception as e:
                self.logger.error(f"Error processing row {index}: {e}")
        self.logger.info(f"Extraction completed. Extracted rows: {len(results)}")
        return pd.DataFrame(results)
