import logging
from etl.config.mappings import register_mapping, authority_mapping

logger = logging.getLogger(__name__)

def extract_registered_entries(data, lang):
    """
    Extracts registered entry details from JSON data with register and authority mappings.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted registered entry rows.
    """
    rows = []
    register_lang = register_mapping.get(lang, None)
    authority_lang = authority_mapping.get(lang, None)

    if register_lang is None or authority_lang is None:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue
        
        for entry in company.get('registeredEntries', []):
            raw_register = entry.get('register', None)
            mapped_register = register_lang.get(raw_register, raw_register)
            
            raw_authority = entry.get('authority', None)
            mapped_authority = authority_lang.get(raw_authority, raw_authority)
            
            rows.append({
                "businessId": business_id,
                "type": entry.get('type', ''), 
                "registrationDate": entry.get('registrationDate', ''),
                "endDate": entry.get('endDate', None),
                "register": mapped_register,
                "authority": mapped_authority
            })
    return rows
