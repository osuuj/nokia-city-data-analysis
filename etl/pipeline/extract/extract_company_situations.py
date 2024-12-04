import logging
from etl.config.mappings import type_mapping, source_mapping

logger = logging.getLogger(__name__)

def extract_company_situations(data, lang):
    """
    Extracts company situations from JSON data for a specific language.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted company situation rows.
    """
    rows = []
    type_lang = type_mapping.get(lang, None)
    source_lang = source_mapping.get(lang, None)

    if type_lang is None or source_lang is None:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        for situation in company.get('companySituations', []):
            # Map type
            raw_type = situation.get('type', '')
            mapped_type = type_lang.get(raw_type, raw_type)
            
            # Map source
            raw_source = situation.get('source', None)
            mapped_source = source_lang.get(raw_source, raw_source)
            
            rows.append({
                "businessId": business_id,
                "type": mapped_type,
                "registrationDate": situation.get('registrationDate', ''),
                "endDate": situation.get('endDate', None),
                "source": mapped_source
            })
    return rows
