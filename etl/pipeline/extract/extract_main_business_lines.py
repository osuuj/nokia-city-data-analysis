import logging
from etl.config.mappings.dynamic_loader import load_toimi_mappings
from etl.config.config_loader import CONFIG

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
    try:
        if lang not in toimi_mappings["TOIMI"]:
            logger.error(f"Invalid language code: {lang}")
            return rows

        for company in data:
            business_id = company.get('businessId', {}).get('value', None)
            if not business_id:
                logger.warning("Skipping company with missing business ID.")
                continue
            
            main_business_line = company.get('mainBusinessLine', {})
            if main_business_line:
                raw_type = main_business_line.get('type', '')
                type_code_set = main_business_line.get('typeCodeSet', 'TOIMI')

                # Fetch appropriate mapping
                type_mapping = toimi_mappings.get(type_code_set, {}).get(lang, {})
                mapped_type = type_mapping.get(raw_type, raw_type)  # Default to raw if not found
                
                rows.append({
                    "businessId": business_id,
                    "type": mapped_type,
                    "typeCodeSet": type_code_set,
                    "registrationDate": main_business_line.get('registrationDate', ''),
                    "source": main_business_line.get('source', '')
                })

        logger.info(f"Extracted {len(rows)} main business lines for language: {lang}")

    except Exception as e:
        logger.error(f"Error in extract_main_business_lines: {e}")

    return rows
