import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value
from etl.config.mappings.mappings import type_mapping, source_mapping

logger = logging.getLogger(__name__)

def extract_company_situations(data, lang):
    """
    Extracts company situations with type and source mappings.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with company situations.
    """
    rows = []
    if not (validate_language(lang, type_mapping) and validate_language(lang, source_mapping)):
        return rows

    type_lang = type_mapping[lang]
    source_lang = source_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for situation in company.get('companySituations', []):
            rows.append({
                "businessId": business_id,
                "type": map_value(situation.get('type', ''), type_lang),
                "registrationDate": situation.get('registrationDate', ''),
                "endDate": situation.get('endDate', None),
                "source": map_value(situation.get('source', None), source_lang)
            })
    return rows
