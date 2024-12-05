import logging
from etl.utils.extract_utils import get_business_id, validate_language, filter_by_language_code
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_company_form_descriptions(data, lang):
    """
    Extracts descriptions for company forms filtered by language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for filtering (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with company form descriptions.
    """
    rows = []

    language_code_mapping = mappings.get_mapping("language_code_mapping", lang)

    if not validate_language(lang, language_code_mapping):
        return rows

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for form in company.get('companyForms', []):
            descriptions = filter_by_language_code(form.get('descriptions', []), lang, language_code_mapping)
            for desc in descriptions:
                rows.append({
                    "businessId": business_id,
                    "type": form.get('type', ''),
                    "description": desc.get('description', '')
                })
    return rows
