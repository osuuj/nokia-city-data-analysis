import json
import os
from config import CITY_FILTERED_PATH, SPLIT_DIR

# Function to split data into smaller chunks
def split_json_file(input_file_path, output_dir, chunk_size=1000):
    with open(input_file_path, 'r') as file:
        data = json.load(file)
    
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data), chunk_size):
        chunk = data[i:i + chunk_size]
        with open(f"{output_dir}/chunk_{i//chunk_size}.json", 'w') as chunk_file:
            json.dump(chunk, chunk_file)
    
    print(f"Data split into chunks and saved to {output_dir}")

# Define file paths
input_file_path = CITY_FILTERED_PATH
output_dir = os.path.join(os.path.dirname(CITY_FILTERED_PATH), 'split')

# Run the split
split_json_file(input_file_path, output_dir)