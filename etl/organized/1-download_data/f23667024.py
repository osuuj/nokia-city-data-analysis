import os
import requests
import zipfile
from config import URLS, FILE_PATHS, EXTRACTED_DIR

def download_file(url, file_path):
    """Download a file from a URL to a specified path."""
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted old file at {file_path}")
        
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes
        
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=128):
                file.write(chunk)
        print(f"Downloaded file to {file_path}")
    except requests.RequestException as e:
        print(f"Failed to download file from {url}. Error: {e}")

def extract_zip_file(zip_file_path, extracted_dir):
    """Extract a ZIP file to a specified directory."""
    try:
        if os.path.exists(extracted_dir):
            for root, dirs, files in os.walk(extracted_dir, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    os.rmdir(os.path.join(root, name))
            print(f"Cleared old extracted files in {extracted_dir}")
        
        with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(extracted_dir)
        print(f"Extracted ZIP file to {extracted_dir}")
    except zipfile.BadZipFile as e:
        print(f"Failed to extract ZIP file {zip_file_path}. Error: {e}")

def main():
    for key, url in URLS.items():
        file_path = FILE_PATHS[key]
        download_file(url, file_path)
        if key == 'all_companies':
            extract_zip_file(file_path, EXTRACTED_DIR)

if __name__ == "__main__":
    main()