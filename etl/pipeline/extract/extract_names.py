import logging

logger = logging.getLogger(__name__)

def extract_names(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue
        for name_entry in company.get('names', []):
            rows.append({
                "businessId": business_id,
                "name": name_entry.get('name', ''),
                "type": name_entry.get('type', ''),
                "registrationDate": name_entry.get('registrationDate', ''),
                "endDate": name_entry.get('endDate', None),
                "version": name_entry.get('version', 0),
                "source": name_entry.get('source', '')
            })
    return rows
