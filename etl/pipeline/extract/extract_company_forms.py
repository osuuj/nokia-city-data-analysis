import logging
from etl.config.mappings import source_mapping

logger = logging.getLogger(__name__)

def extract_company_forms(data, lang):
    """
    Extracts company forms from JSON data.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted company form rows.
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
        
        for form in company.get('companyForms', []):
            # Map source
            raw_source = form.get('source', None)
            mapped_source = source_lang.get(raw_source, raw_source)
            
            rows.append({
                "businessId": business_id,
                "type": form.get('type', ''),
                "registrationDate": form.get('registrationDate', ''),
                "endDate": form.get('endDate', None),
                "version": form.get('version', 0),
                "source": mapped_source
            })
    return rows

