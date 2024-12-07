import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value, validate_language

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_registered_entries(data, lang):
    """
    Extracts registered entry details with register and authority mappings.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with registered entries.
    """
    rows = []

    try:
        # Retrieve necessary mappings
        register_mapping = mappings.get_mapping("register_mapping", lang)
        authority_mapping = mappings.get_mapping("authority_mapping", lang)
        language_code_mapping = mappings.get_mapping("language_code_mapping")

        # Validate language for mappings
        if not (
            validate_language(lang, register_mapping, language_code_mapping)
            and validate_language(lang, authority_mapping, language_code_mapping)
        ):
            logger.error(f"Invalid language: {lang} for registered entries.")
            return rows

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.warning("Skipping company with missing business ID.")
                continue

            for entry in company.get("registeredEntries", []):
                rows.append(
                    {
                        "businessId": business_id,
                        "type": entry.get("type", ""),
                        "registrationDate": entry.get("registrationDate", ""),
                        "endDate": entry.get("endDate", None),
                        "register": map_value(
                            entry.get("register", None), register_mapping
                        ),
                        "authority": map_value(
                            entry.get("authority", None), authority_mapping
                        ),
                    }
                )

        logger.info(f"Extracted {len(rows)} registered entries for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_registered_entries: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_registered_entries: {e}")

    return rows
