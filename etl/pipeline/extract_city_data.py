import os
import json
import ijson
from etl.config.config import EXTRACTED_DIR, get_city_paths

def find_latest_json_file(directory):
    """Find the latest JSON file in the given directory."""
    json_files = [f for f in os.listdir(directory) if f.endswith('.json')]
    if not json_files:
        return None
    latest_file = max(json_files, key=lambda f: os.path.getmtime(os.path.join(directory, f)))
    return latest_file

def extract_data_by_city(item, city):
    """Check if any post office in the item's addresses is in the specified city."""
    return any(
        post_office.get('city', '') == city
        for address in item.get('addresses', [])
        for post_office in address.get('postOffices', [])
    )

def extract_and_filter_city_data(city):
    # Get paths based on the city
    paths = get_city_paths(city)
    filtered_dir = paths['filtered_dir']

    # Create the filtered directory if it doesn't exist
    os.makedirs(filtered_dir, exist_ok=True)

    # Find the latest JSON file in the extracted directory
    latest_json_file = find_latest_json_file(EXTRACTED_DIR)
    if not latest_json_file:
        raise FileNotFoundError(f"No JSON file found in {EXTRACTED_DIR}")

    input_file_path = os.path.join(EXTRACTED_DIR, latest_json_file)

    # Define the output file path within the city-specific folder
    output_file_path = os.path.join(filtered_dir, f"{city}_filtered.json")

    # Read and filter items with address in the specified city
    with open(input_file_path, 'r') as file, open(output_file_path, 'w') as output_file:
        parser = ijson.items(file, 'item')
        filtered_items = []
        for item in parser:
            if extract_data_by_city(item, city):
                filtered_items.append(item)
        json.dump(filtered_items, output_file, indent=4)

    print(f"Filtered data saved to {output_file_path}")
    print(f"Total items filtered: {len(filtered_items)}")
