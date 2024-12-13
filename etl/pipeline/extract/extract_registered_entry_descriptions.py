import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_registered_entry_descriptions(
    data: pd.DataFrame, lang: str
) -> pd.DataFrame:
    """Extracts registered entry descriptions filtered by language.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation for filtering ("fi", "sv", "en").

    Returns:
        pd.DataFrame: Extracted registered entry description rows.
    """
    registered_entry_descriptions: List[Dict[str, Any]] = []
    skipped_records = 0

    # Retrieve language code mapping
    language_code_mapping = mappings.get_mapping("language_code_mapping")

    if lang not in language_code_mapping:
        logger.error(f"Invalid language code: {lang}")
        return pd.DataFrame(registered_entry_descriptions)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = company.get("businessId", {}).get("value")
        if not business_id:
            logger.debug("Skipping company without businessId.")
            skipped_records += 1
            continue

        for entry in company.get("registeredEntries", []):
            descriptions = entry.get("descriptions", [])
            for desc in descriptions:
                try:
                    # Map raw language code back to language abbreviation
                    raw_language_code = desc.get("languageCode")
                    mapped_lang = next(
                        (
                            key
                            for key, value in language_code_mapping.items()
                            if value == str(raw_language_code)
                        ),
                        None,
                    )

                    if mapped_lang == lang:
                        registered_entry_descriptions.append(
                            {
                                "businessId": business_id,
                                "entryType": entry.get(
                                    "type", ""
                                ),  # Keep raw type value
                                "description": desc.get("description", ""),
                            }
                        )
                except KeyError as e:
                    logger.error(f"Skipping record due to missing key: {e}")
                    skipped_records += 1
                except Exception as e:
                    logger.error(f"Unexpected error while processing record: {e}")
                    skipped_records += 1

    logger.info(
        f"Processed {len(registered_entry_descriptions)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(registered_entry_descriptions)
