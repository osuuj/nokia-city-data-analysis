import logging
from etl.utils.extract_utils import get_business_id, validate_language, map_value
from etl.config.mappings.mappings import register_mapping, authority_mapping

logger = logging.getLogger(__name__)

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
    if not (validate_language(lang, register_mapping) and validate_language(lang, authority_mapping)):
        return rows

    register_lang = register_mapping[lang]
    authority_lang = authority_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        for entry in company.get('registeredEntries', []):
            rows.append({
                "businessId": business_id,
                "type": entry.get('type', ''),
                "registrationDate": entry.get('registrationDate', ''),
                "endDate": entry.get('endDate', None),
                "register": map_value(entry.get('register', None), register_lang),
                "authority": map_value(entry.get('authority', None), authority_lang)
            })

    return rows
