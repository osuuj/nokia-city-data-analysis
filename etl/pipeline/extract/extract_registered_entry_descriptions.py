import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_registered_entry_descriptions(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts registered entry descriptions filtered by language.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation for filtering ("fi", "sv", "en").

    Returns:
        List[Dict[str, Any]]: Extracted registered entry description rows.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Retrieve language code mapping
        language_code_mapping = mappings.get_mapping("language_code_mapping")

        if lang not in language_code_mapping:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                logger.debug("Skipping company without businessId.")
                continue

            for entry in company.get("registeredEntries", []):
                descriptions = entry.get("descriptions", [])
                for desc in descriptions:
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
                        rows.append(
                            {
                                "businessId": business_id,
                                "entryType": entry.get(
                                    "type", ""
                                ),  # Keep raw type value
                                "description": desc.get("description", ""),
                            }
                        )

        logger.info(
            f"Extracted {len(rows)} registered entry descriptions for language: {lang}"
        )

    except KeyError as e:
        logger.error(f"KeyError in extract_registered_entry_descriptions: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_registered_entry_descriptions: {e}")

    return rows
