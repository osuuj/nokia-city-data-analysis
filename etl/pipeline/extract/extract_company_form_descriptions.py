import logging
from etl.utils.extract_utils import get_business_id, filter_by_language_code
from etl.config.mappings.mappings import language_code_mapping

logger = logging.getLogger(__name__)

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
