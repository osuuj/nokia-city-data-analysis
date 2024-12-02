import logging

logger = logging.getLogger(__name__)

def extract_company_situations(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for situation in company.get('companySituations', []):
            rows.append({
                "businessId": business_id,
                "type": situation.get('type', ''),
                "registrationDate": situation.get('registrationDate', ''),
                "endDate": situation.get('endDate', None),
                "source": situation.get('source', '')
            })
    return rows
