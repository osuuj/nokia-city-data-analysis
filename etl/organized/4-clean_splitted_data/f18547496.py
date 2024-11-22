import pandas as pd
import os
from config import get_city_paths

# Define the city to process
CITY = 'NOKIA'

# Get paths based on the city
_, SPLIT_DIR, CLEANED_DIR = get_city_paths(CITY)

# Function to clean data
def clean_data(df):
    # Log the columns of the DataFrame
    print(f"Columns in DataFrame: {df.columns.tolist()}")
    
    # Example cleaning steps:
    # 1. Remove records with missing 'lastModified' if the column exists
    if 'lastModified' in df.columns:
        df_cleaned = df.dropna(subset=['lastModified'])
    else:
        df_cleaned = df
    
    # 2. Remove irrelevant columns (example: 'source', 'version')
    columns_to_remove = ['source', 'version']
    df_cleaned = df_cleaned.drop(columns=columns_to_remove, errors='ignore')
    
    # 3. Handle missing values in specific columns (example: fill NaNs with empty strings)
    df_cleaned = df_cleaned.fillna('')
    
    return df_cleaned

# Function to clean and save split data
def clean_split_data(input_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    for file_name in os.listdir(input_dir):
        if file_name.endswith('.json'):
            file_path = os.path.join(input_dir, file_name)
            df = pd.read_json(file_path, lines=True)
            
            # Clean the data
            df_cleaned = clean_data(df)
            
            # Save the cleaned data
            output_file_path = os.path.join(output_dir, file_name)
            df_cleaned.to_json(output_file_path, orient='records', lines=True)
    
    print(f"Cleaned data saved to {output_dir}")

# Define file paths
input_dir = SPLIT_DIR
output_dir = CLEANED_DIR

# Run the cleaning process
clean_split_data(input_dir, output_dir)
