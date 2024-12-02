import logging

logger = logging.getLogger(__name__)

def extract_companies(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue
        rows.append({
            "businessId": business_id,
            "registrationDate": company.get('businessId', {}).get('registrationDate', ''),
            "tradeRegisterStatus": company.get('tradeRegisterStatus', ''),
            "status": company.get('status', ''),
            "registrationDateCompany": company.get('registrationDate', ''),
            "endDate": company.get('endDate', ''),
            "lastModified": company.get('lastModified', '')
        })
    return rows

