import logging

from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG["mappings_path"]
mappings = Mappings(mappings_file)


def extract_company_form_descriptions(data, lang):
    """
    Extracts company form descriptions from JSON data for a specific language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation to filter descriptions ("fi", "sv", "en").

    Returns:
        list: Extracted company form descriptions for the specified language.
    """
    language_code_mapping = mappings.get_mapping("language_code_mapping")
    rows = []

    # Ensure `lang` is valid and map language codes
    if lang not in language_code_mapping:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get("businessId", {}).get("value", None)
        if not business_id:
            continue  # Skip if no businessId

        for form in company.get("companyForms", []):
            descriptions = form.get("descriptions", [])
            for desc in descriptions:
                # Map the raw language code back to the language abbreviation
                raw_language_code = desc.get("languageCode", None)
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
                            "type": form.get("type", ""),  # Keep raw type value
                            "description": desc.get("description", ""),
                        }
                    )
    return rows
