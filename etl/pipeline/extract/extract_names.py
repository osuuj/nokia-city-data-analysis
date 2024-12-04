import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value
from etl.config.mappings.mappings import name_type_mapping

logger = logging.getLogger(__name__)

def extract_names(data, lang):
    """
    Extracts names of companies and maps their types.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings (e.g., "fi", "en", "sv").

    Returns:
        list: Extracted rows with company names and types.
    """
    rows = []

    if not validate_language(lang, name_type_mapping):
        return rows

    name_type_lang = name_type_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for name in company.get('names', []):
            rows.append({
                "businessId": business_id,
                "type": map_value(name.get('type', ''), name_type_lang),
                "name": name.get('name', ''),
                "registrationDate": name.get('registrationDate', ''),
                "endDate": name.get('endDate', None),
            })
    return rows
