import logging

logger = logging.getLogger(__name__)

def extract_company_forms(data):
    rows = []
    for company in data:
        business_id = company.get('businessId', {}).get('value', None)
        if not business_id:
            continue  # Skip if no businessId
        for form in company.get('companyForms', []): 
            rows.append({
                "businessId": business_id,
                "type": form.get('type', ''),
                "registrationDate": form.get('registrationDate', ''),
                "endDate": form.get('endDate', None),
                "version": form.get('version', 0),
                "source": form.get('source', '')
            })
    return rows

