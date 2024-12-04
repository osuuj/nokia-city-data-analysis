import logging
from etl.config.mappings import source_mapping, load_toimi_mappings

logger = logging.getLogger(__name__)

# Load TOIMI mappings globally
toimi_mappings = load_toimi_mappings()

def extract_main_business_lines(data, lang):
    """
    Extracts main business line details from JSON data with type and source mappings.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted main business line rows.
    """
    rows = []
    source_lang = source_mapping.get(lang, None)

    if source_lang is None:
        logger.error(f"Invalid language code: {lang}")
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        main_business_line = company.get('mainBusinessLine', {})
        if main_business_line:
            raw_type = main_business_line.get('type', '')
            type_code_set = main_business_line.get('typeCodeSet', '')
            
            # Dynamically select the appropriate TOIMI mapping
            type_mapping = toimi_mappings.get(type_code_set, {}).get(lang, {})
            mapped_type = type_mapping.get(raw_type, raw_type)  # Map type using the appropriate TOIMI set
            
            raw_source = main_business_line.get('source', None)
            mapped_source = source_lang.get(raw_source, raw_source)
            
            rows.append({
                "businessId": business_id,
                "type": mapped_type,
                "typeCodeSet": type_code_set,
                "registrationDate": main_business_line.get('registrationDate', ''),
                "source": mapped_source
            })
    return rows

