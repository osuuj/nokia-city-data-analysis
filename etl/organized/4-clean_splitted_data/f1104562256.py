import os
import pandas as pd
from config import CITY, get_city_paths

def clean_data(df):
    """Clean the DataFrame by performing various operations."""
    # Drop unnecessary columns
    columns_to_remove = ['euId.value', 'euId.source', 'companySituations', 'website']
    df_cleaned = df.drop(columns=columns_to_remove, errors='ignore')
    
    # Normalize nested structures
    if 'businessId.value' in df_cleaned.columns:
        df_cleaned['businessId'] = df_cleaned['businessId.value']
        df_cleaned = df_cleaned.drop(columns=['businessId.value', 'businessId.registrationDate', 'businessId.source'], errors='ignore')
    
    if 'names' in df_cleaned.columns:
        df_cleaned['name'] = df_cleaned['names'].apply(lambda x: x[0]['name'] if x else None)
        df_cleaned = df_cleaned.drop(columns=['names'], errors='ignore')
    
    if 'mainBusinessLine.descriptions' in df_cleaned.columns:
        df_cleaned['mainBusinessLine'] = df_cleaned['mainBusinessLine.descriptions'].apply(lambda x: x[0]['description'] if x else None)
        df_cleaned = df_cleaned.drop(columns=['mainBusinessLine.descriptions'], errors='ignore')
    
    if 'addresses' in df_cleaned.columns:
        df_cleaned['address'] = df_cleaned['addresses'].apply(lambda x: x[0]['street'] if x else None)
        df_cleaned = df_cleaned.drop(columns=['addresses'], errors='ignore')
    
    # Handle missing values
    df_cleaned = df_cleaned.fillna('')
    
    # Convert dates to a standard format
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