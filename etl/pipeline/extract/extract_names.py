import logging
from etl.config.mappings import name_type_mapping, source_mapping

logger = logging.getLogger(__name__)

def extract_names(data, lang):
    """
    Extracts names details from JSON data with type and source mappings.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted names rows.
    """
    rows = []
    type_lang = name_type_mapping.get(lang, None)
    source_lang = source_mapping.get(lang, None)

    if type_lang is None or source_lang is None:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue
        
        for name_entry in company.get('names', []):
            # Map type
            raw_type = name_entry.get('type', None)
            mapped_type = type_lang.get(raw_type, raw_type)
            
            # Map source
            raw_source = name_entry.get('source', None)
            mapped_source = source_lang.get(raw_source, raw_source)
            
            rows.append({
                "businessId": business_id,
                "name": name_entry.get('name', ''),
                "type": mapped_type,
                "registrationDate": name_entry.get('registrationDate', ''),
                "endDate": name_entry.get('endDate', None),
                "version": name_entry.get('version', 0),
                "source": mapped_source
            })
    return rows
