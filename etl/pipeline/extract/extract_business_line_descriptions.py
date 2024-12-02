import logging

logger = logging.getLogger(__name__)

def extract_business_line_descriptions(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        main_business_line = company.get('mainBusinessLine')
        if main_business_line is None:
            continue  # Skip if no mainBusinessLine
        
        descriptions = main_business_line.get('descriptions', [])
        for desc in descriptions:
            rows.append({
                "businessId": business_id,
                "languageCode": desc.get('languageCode', ''),
                "description": desc.get('description', '')
            })
    return rows
