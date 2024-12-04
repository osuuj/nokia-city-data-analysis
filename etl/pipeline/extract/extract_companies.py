import logging
from datetime import datetime
from etl.utils.extract_utils import get_business_id, map_value
from etl.config.mappings.mappings import rek_kdi_mapping, status_mapping

logger = logging.getLogger(__name__)

def extract_companies(data, lang):
    rows = []

    if not validate_language(lang, rek_kdi_mapping) or not validate_language(lang, status_mapping):
        return rows

    rek_kdi_lang = rek_kdi_mapping[lang]
    status_lang = status_mapping[lang]

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        trade_status = map_value(company.get('tradeRegisterStatus', ''), rek_kdi_lang)
        status = map_value(company.get('status', ''), status_lang)

        def parse_date(date_str):
            try:
                return datetime.fromisoformat(date_str).date() if date_str else None
            except ValueError:
                return None

        rows.append({
            "businessId": business_id,
            "tradeRegisterStatus": trade_status,
            "status": status,
            "lastModified": parse_date(company.get('lastModified', '')),
        })

    return rows

