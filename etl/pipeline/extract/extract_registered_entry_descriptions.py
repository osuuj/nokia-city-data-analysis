import logging

logger = logging.getLogger(__name__)

def extract_registered_entry_descriptions(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for entry in company.get('registeredEntries', []):
            descriptions = entry.get('descriptions', [])
            for desc in descriptions:
                rows.append({
                    "businessId": business_id,
                    "entryType": entry.get('type', ''),
                    "languageCode": desc.get('languageCode', ''),
                    "description": desc.get('description', '')
                })
    return rows

