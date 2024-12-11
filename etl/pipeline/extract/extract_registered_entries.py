import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value, validate_language

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_registered_entries(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts registered entry details with register and authority mappings.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").

    Returns:
        List[Dict[str, Any]]: Extracted rows with registered entries.
    """
    rows: List[Dict[str, Any]] = []

    try:
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
            return rows

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.debug("Skipping company with missing business ID.")
                continue

            for entry in company.get("registeredEntries", []):
                # Map register and authority values
                mapped_register = map_value(
                    entry.get("register", None), register_mapping
                )
                mapped_authority = map_value(
                    entry.get("authority", None), authority_mapping
                )

                rows.append(
                    {
                        "businessId": business_id,
                        "type": entry.get("type", ""),
                        "registrationDate": entry.get("registrationDate", ""),
                        "endDate": entry.get("endDate", None),
                        "register": mapped_register,
                        "authority": mapped_authority,
                    }
                )

        logger.info(f"Extracted {len(rows)} registered entries for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_registered_entries: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_registered_entries: {e}")

    return rows
