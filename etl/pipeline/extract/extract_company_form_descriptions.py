import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_company_form_descriptions(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts company form descriptions from JSON data for a specific language.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation to filter descriptions ("fi", "sv", "en").

    Returns:
        List[Dict[str, Any]]: Extracted company form descriptions for the specified language.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Load language code mapping
        language_code_mapping = mappings.get_mapping("language_code_mapping")

        if lang not in language_code_mapping:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get("businessId", {}).get("value")
            if not business_id:
                logger.debug(f"Skipping company with missing businessId: {company}")
                continue

            for form in company.get("companyForms", []):
                descriptions = form.get("descriptions", [])
                for desc in descriptions:
                    # Map the raw language code back to the language abbreviation
                    raw_language_code = desc.get("languageCode")
                    mapped_lang = next(
                        (
                            key
                            for key, value in language_code_mapping.items()
                            if value == str(raw_language_code)
                        ),
                        None,
                    )

                    # Append data if the language matches
                    if mapped_lang == lang:
                        rows.append(
                            {
                                "businessId": business_id,
                                "type": form.get("type", ""),  # Preserve raw type value
                                "description": desc.get("description", ""),
                            }
                        )
    except KeyError as e:
        logger.error(f"Missing key during company form description extraction: {e}")
    except Exception as e:
        logger.error(
            f"Unexpected error during company form description extraction: {e}"
        )

    return rows
