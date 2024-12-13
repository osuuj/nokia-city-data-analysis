import logging
import pandas as pd
from typing import Any, Dict, List
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value, validate_language

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["config_files"]["mappings_file"]
mappings = Mappings(mappings_file)


def extract_registered_entries(data: pd.DataFrame, lang: str) -> pd.DataFrame:
    """Extracts registered entry details with register and authority mappings.

    Args:
        data (pd.DataFrame): DataFrame containing company data.
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").

    Returns:
        pd.DataFrame: Extracted rows with registered entries.
    """
    registered_entries: List[Dict[str, Any]] = []
    skipped_records = 0

    # Retrieve necessary mappings
    register_mapping = mappings.get_mapping("register_mapping", lang)
    authority_mapping = mappings.get_mapping("authority_mapping", lang)
    language_code_mapping = mappings.get_mapping("language_code_mapping")

    # Validate the language for mappings
    if not (
        validate_language(lang, register_mapping, language_code_mapping)
        and validate_language(lang, authority_mapping, language_code_mapping)
    ):
        logger.error(f"Invalid language: {lang} for registered entries.")
        return pd.DataFrame(registered_entries)

    for _, row in data.iterrows():
        company = row.to_dict()
        if not isinstance(company, dict):
            logger.error(f"Unexpected data type: {type(company)}. Expected dict.")
            skipped_records += 1
            continue

        business_id = get_business_id(company)
        if not business_id:
            logger.debug("Skipping company with missing business ID.")
            skipped_records += 1
            continue

        for entry in company.get("registeredEntries", []):
            try:
                # Map register and authority values
                mapped_register = map_value(
                    entry.get("register", None), register_mapping
                )
                mapped_authority = map_value(
                    entry.get("authority", None), authority_mapping
                )

                registered_entries.append(
                    {
                        "businessId": business_id,
                        "type": entry.get("type", ""),
                        "registrationDate": entry.get("registrationDate", ""),
                        "endDate": entry.get("endDate", None),
                        "register": mapped_register,
                        "authority": mapped_authority,
                    }
                )
            except KeyError as e:
                logger.error(f"Skipping record due to missing key: {e}")
                skipped_records += 1
            except Exception as e:
                logger.error(f"Unexpected error while processing record: {e}")
                skipped_records += 1

    logger.info(
        f"Processed {len(registered_entries)} records. Skipped {skipped_records} records."
    )
    return pd.DataFrame(registered_entries)
