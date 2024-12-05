import logging
from datetime import datetime
from etl.utils.extract_utils import get_business_id, map_value
from etl.config.config_loader import CONFIG
from etl.config.mappings.mappings import Mappings

logger = logging.getLogger(__name__)

# Initialize mappings
mappings_file = CONFIG['mappings_path']
mappings = Mappings(mappings_file)

def extract_companies(data, lang):
    rows = []

    rek_kdi_mapping = mappings.get_mapping("rek_kdi_mapping", lang)
    status_mapping = mappings.get_mapping("status_mapping", lang)

    if not rek_kdi_mapping or not status_mapping:
        logger.error(f"Mappings for language {lang} not found.")
        return rows

    for company in data:
        business_id = get_business_id(company)
        if not business_id:
            continue

        trade_status = map_value(company.get('tradeRegisterStatus', ''), rek_kdi_mapping)
        status = map_value(company.get('status', ''), status_mapping)

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
