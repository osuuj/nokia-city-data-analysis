import ijson
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get file paths from environment variables
RAW_DATA_PATH = os.getenv('RAW_DATA_PATH')
PROCESSED_DATA_PATH = os.getenv('PROCESSED_DATA_PATH')

# Print the paths to verify they are correct
print(f"RAW_DATA_PATH: {RAW_DATA_PATH}")
print(f"PROCESSED_DATA_PATH: {PROCESSED_DATA_PATH}")

# Check if the raw data file exists
if not os.path.exists(RAW_DATA_PATH):
    raise FileNotFoundError(f"Raw data file not found: {RAW_DATA_PATH}")

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