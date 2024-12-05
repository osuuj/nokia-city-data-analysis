import os
import pandas as pd
from sqlalchemy import create_engine, text
from etl.config.config_loader import CONFIG, database_url

# Path to the processed data
processed_dir = CONFIG['directory_structure']['processed_dir']
processed_data_path = os.path.join(processed_dir, "cleaned")
db_schema = CONFIG['directory_structure']['db_schema_path']
entities = CONFIG['entities']

def create_tables(engine, schema_file):
    """Create database tables from the schema SQL file."""
    with open(schema_file, 'r') as file:
        schema_sql = file.read()
    with engine.connect() as connection:
        for statement in schema_sql.split(';'):
            if statement.strip():
                connection.execute(text(statement))
        print("Tables created successfully.")

def load_data(engine, processed_data_path, entities):
    """Load processed CSV files into the database."""
    for entity in entities:
        folder_path = os.path.join(processed_data_path, entity["name"])
        try:
            for file in os.listdir(folder_path):
                if file.endswith(".csv"):
                    file_path = os.path.join(folder_path, file)
                    # Load the CSV into a DataFrame
                    df = pd.read_csv(file_path)
                    
                    # Write the DataFrame to the database
                    df.to_sql(entity["table"], engine, if_exists="append", index=False)
                    print(f"Loaded {file} into {entity['table']}.")
        except Exception as e:
            print(f"Failed to load data for {entity['name']}: {e}")

if __name__ == "__main__":
    # Create the database engine
    engine = create_engine(database_url)
    
    # Create tables
    create_tables(engine, db_schema)
    
    # Load data
    load_data(engine, processed_data_path, entities)
