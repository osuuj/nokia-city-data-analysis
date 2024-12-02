import logging

logger = logging.getLogger(__name__)

def extract_main_business_lines(data):
    rows = []
    for company in data:  # Directly iterate over data
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        
        main_business_line = company.get('mainBusinessLine', {})
        if main_business_line:
            rows.append({
                "businessId": business_id,
                "type": main_business_line.get('type', ''),
                "typeCodeSet": main_business_line.get('typeCodeSet', ''),
                "registrationDate": main_business_line.get('registrationDate', ''),
                "source": main_business_line.get('source', '')
            })
    return rows

