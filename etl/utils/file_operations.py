import json
import os
import ijson
from etl.utils.directory_operations import ensure_directory_exists

def get_unzipped_file_name(extracted_dir):
    """Get the name of the file in the specified extracted directory."""
    try:
        # List all files in the directory
        files = os.listdir(extracted_dir)
        # Filter out directories, keeping only files
        files = [f for f in files if os.path.isfile(os.path.join(extracted_dir, f))]
        # Ensure there is only one unzipped file
        if len(files) == 1:
            return files[0]
        elif len(files) > 1:
            print(f"Multiple files found in {extracted_dir}: {files}")
        else:
            print(f"No files found in {extracted_dir}.")
    except Exception as e:
        print(f"Error accessing directory {extracted_dir}: {e}")
    return None

def split_json_to_files(file_path, output_dir, chunk_size=1000):
    """Splits a large JSON file into smaller JSON files."""
    # Ensure the directory exists
    ensure_directory_exists(output_dir) 
    chunk = []
    chunk_index = 1

    with open(file_path, 'r', encoding='utf-8') as file:
        for record in ijson.items(file, 'item'):
            chunk.append(record)
            if len(chunk) >= chunk_size:
                output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
                with open(output_file, 'w', encoding='utf-8') as out_file:
                    json.dump(chunk, out_file, indent=4)
                chunk = []  # Clear the buffer
                chunk_index += 1
        
        # Write remaining records
        if chunk:
            output_file = os.path.join(output_dir, f"chunk_{chunk_index}.json")
            with open(output_file, 'w', encoding='utf-8') as out_file:
                json.dump(chunk, out_file, indent=4)
