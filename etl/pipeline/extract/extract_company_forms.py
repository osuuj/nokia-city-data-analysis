import logging
from typing import Any, Dict, List

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings
from etl.utils.extract_utils import get_business_id, map_value, validate_language

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_company_forms(
    data: List[Dict[str, Any]], lang: str
) -> List[Dict[str, Any]]:
    """Extracts company forms with source mapping.

    Args:
        data (List[Dict[str, Any]]): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        List[Dict[str, Any]]: Extracted rows with company forms.
    """
    rows: List[Dict[str, Any]] = []

    try:
        # Retrieve necessary mappings
        source_mapping = mappings.get_mapping("source_mapping")
        language_code_mapping = mappings.get_mapping("language_code_mapping")

        # Validate the language
        if not validate_language(lang, source_mapping, language_code_mapping):
            logger.error(f"Invalid language: {lang} for company forms.")
            return rows

        for company in data:
            business_id = get_business_id(company)
            if not business_id:
                logger.debug("Skipping company with missing business ID.")
                continue

            for form in company.get("companyForms", []):
                rows.append(
                    {
                        "businessId": business_id,
                        "type": form.get("type", ""),
                        "registrationDate": form.get("registrationDate", ""),
                        "endDate": form.get("endDate", None),
                        "version": form.get("version", 0),
                        "source": map_value(form.get("source", None), source_mapping),
                    }
                )

        logger.info(f"Extracted {len(rows)} company forms for language: {lang}")

    except KeyError as e:
        logger.error(f"KeyError in extract_company_forms: {e}")
    except Exception as e:
        logger.error(f"Unexpected error in extract_company_forms: {e}")

    return rows
