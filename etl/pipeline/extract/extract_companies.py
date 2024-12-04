import logging
from datetime import datetime
from etl.config.mappings import rek_kdi_mapping, status_mapping

logger = logging.getLogger(__name__)

def extract_companies(data, lang):
    """
    Extracts company details from JSON data.

    Args:
        data (list): List of company data.
        lang (str): Language abbreviation for mappings ("fi", "sv", "en").

    Returns:
        list: Extracted company rows.
    """
    rows = []
    rek_kdi_lang = rek_kdi_mapping.get(lang, None)
    status_lang = status_mapping.get(lang, None)  # Force status mapping to English

    if rek_kdi_lang is None or status_lang is None:
        return rows

    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue
        
        # Map tradeRegisterStatus
        raw_trade_status = str(company.get('tradeRegisterStatus', ''))
        trade_status = rek_kdi_lang.get(raw_trade_status, raw_trade_status)

        # Map status
        raw_status = str(company.get('status', None))
        mapped_status = status_lang.get(raw_status, raw_status)
        
        # Convert date fields
        def parse_date(date_str):
            try:
                return datetime.fromisoformat(date_str).date() if date_str else None
            except ValueError:
                return None  # Handle invalid dates
            
        # Convert lastModified to date only
        last_modified = company.get('lastModified', '')
        try:
            last_modified_date = datetime.fromisoformat(last_modified).date() if last_modified else ''
        except ValueError:
            last_modified_date = last_modified  # Retain raw value if parsing fails
        
        rows.append({
            "businessId": business_id,
            "registrationDate": company.get('registrationDate', ''),
            "tradeRegisterStatus": trade_status,
            "status": mapped_status,
            "registrationDateCompany": company.get('registrationDateCompany', ''),
            "endDate": company.get('endDate', ''),
            "lastModified": str(last_modified_date)
        })
    return rows

