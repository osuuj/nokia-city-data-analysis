import ijson
import json
from config import RAW_DATA_PATH, PROCESSED_DATA_PATH

# Function to check if the address is in Nokia
def is_address_in_nokia(item):
    return any(
        post_office.get('city', '') == 'NOKIA'
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

# Read and filter items with address in Nokia
with open(RAW_DATA_PATH, 'r') as file, open(PROCESSED_DATA_PATH, 'w') as output_file:
    parser = ijson.items(file, 'item')
    filtered_items = (item for item in parser if is_address_in_nokia(item))
    json.dump(list(filtered_items), output_file, indent=4)