import os
import pandas as pd
from config import CITY, get_city_paths

def clean_data(df):
    """Clean the DataFrame by performing various operations."""
    # Example cleaning steps
    df_cleaned = df.dropna(subset=['name', 'address'])
    df_cleaned = df_cleaned.drop(columns=['euId.value', 'euId.source'], errors='ignore')
    
    # Normalize data (example: convert dates to a standard format)
    if 'registrationDate' in df_cleaned.columns:
        df_cleaned['registrationDate'] = pd.to_datetime(df_cleaned['registrationDate'], errors='coerce')
    
    return df_cleaned

def clean_split_data(input_dir, output_dir, city):
    """Clean and save split data."""
    os.makedirs(output_dir, exist_ok=True)
    
    for file_name in os.listdir(input_dir):
        if file_name.endswith('.json'):
            file_path = os.path.join(input_dir, file_name)
            df = pd.read_json(file_path, lines=True)
            
            # Clean the data
            df_cleaned = clean_data(df)
            
            # Generate new file name
            base_name = os.path.splitext(file_name)[0]
            new_file_name = f"cleaned_{city}_{base_name.split('_')[-1]}.json"
            
            # Save the cleaned data
            output_file_path = os.path.join(output_dir, new_file_name)
            df_cleaned.to_json(output_file_path, orient='records', lines=True)
    
    print(f"Cleaned data saved to {output_dir}")

def main():
    # Get paths based on the city
    _, split_dir, _, cleaned_dir = get_city_paths(CITY)

    # Define file paths
    input_dir = split_dir
    output_dir = cleaned_dir

    # Run the cleaning process
    clean_split_data(input_dir, output_dir, CITY)

if __name__ == "__main__":
    main()