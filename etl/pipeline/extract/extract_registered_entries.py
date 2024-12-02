import logging

logger = logging.getLogger(__name__)

def extract_registered_entries(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for entry in company.get('registeredEntries', []):
            rows.append({
                "businessId": business_id,
                "type": entry.get('type', ''),
                "registrationDate": entry.get('registrationDate', ''),
                "endDate": entry.get('endDate', None),
                "register": entry.get('register', ''),
                "authority": entry.get('authority', ''),
                "source": entry.get('source', '')
            })
    return rows
