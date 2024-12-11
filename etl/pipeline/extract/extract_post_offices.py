import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_post_offices(data: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
    """Extracts post office details from JSON data, filtering by languageCode.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation ("fi", "sv", "en").

    Returns:
        List[Dict[str, Any]]: Extracted post office rows filtered by the specified language.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Load the post office language code mapping
        post_office_language_code = mappings.get_mapping("post_office_language_code")

        # Get the numeric language code for the specified language
        lang_code = post_office_language_code.get(lang)
        if lang_code is None:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                logger.debug("Skipping company without businessId.")
                continue

            for address in company.get("addresses", []):
                for post_office in address.get("postOffices", []):
                    # Check if the languageCode matches the target lang_code
                    if str(post_office.get("languageCode")) == lang_code:
                        rows.append(
                            {
                                "businessId": business_id,
                                "postCode": post_office.get("postCode", ""),
                                "city": post_office.get("city", ""),
                                "active": post_office.get("active", False),
                                "languageCode": lang,  # Store as the original language string
                                "municipalityCode": post_office.get(
                                    "municipalityCode", ""
                                ),
                            }
                        )

        logger.info(f"Extracted {len(rows)} post office records for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_post_offices: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_post_offices: {e}")

    return rows
