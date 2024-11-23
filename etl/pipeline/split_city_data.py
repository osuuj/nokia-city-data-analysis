import os
import json
from etl.config.config import get_city_paths

def find_latest_json_file(directory):
    """Find the latest JSON file in the specified directory."""
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist")
        return None
    
    files = [f for f in os.listdir(directory) if f.endswith('.json')]
    files.sort(reverse=True)
    return files[0] if files else None

def split_json_file(input_file_path, output_dir, city, chunk_size=1000):
    """Split data into smaller chunks and save to output directory."""
    with open(input_file_path, 'r') as file:
        data = json.load(file)
    
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        chunk_file_name = f"splitted_{city}_{i//chunk_size}.json"
        chunk_file_path = os.path.join(output_dir, chunk_file_name)
        with open(chunk_file_path, 'w') as chunk_file:
            json.dump(chunk, chunk_file)
    
    print(f"Data split into chunks and saved to {output_dir}")

def split_city_data(city):
    """Split the latest JSON file for the given city into smaller chunks."""
    city_paths = get_city_paths(city)
    filtered_dir = city_paths['filtered_dir']
    split_dir = city_paths['split_dir']

    # Ensure the split directory exists
    os.makedirs(split_dir, exist_ok=True)

    # Find the latest JSON file in the filtered directory
    latest_json_file = find_latest_json_file(filtered_dir)
    if not latest_json_file:
        print(f"No JSON file found in {filtered_dir}")
        return

    # Define file paths
    input_file_path = os.path.join(filtered_dir, latest_json_file)
    output_dir = split_dir

    # Run the split
    split_json_file(input_file_path, output_dir, city)
