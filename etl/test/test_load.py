import os
import pandas as pd
from sqlalchemy import create_engine, text
from etl.config.config_loader import DIRECTORY_STRUCTURE, DATABASE_URL

# Database configuration
engine = create_engine(DATABASE_URL)

# Path to the processed data
processed_dir = DIRECTORY_STRUCTURE['processed_dir']
processed_data_path = os.path.join(processed_dir, "cleaned")

def create_table(engine, schema_sql):
    """
    Create a single table using the provided schema SQL.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text(schema_sql))
            print("Table created successfully.")
    except Exception as e:
        print(f"Failed to create table: {e}")

def load_table_data(engine, table_name, data_dir):
    """
    Load data for a single table from the specified directory.
    """
    try:
        for file in os.listdir(data_dir):
            if file.endswith(".csv"):
                file_path = os.path.join(data_dir, file)
                print(f"Processing file: {file_path}")
                
                # Load CSV into a DataFrame
                df = pd.read_csv(file_path)
                
                # Debugging: Check for empty strings in date columns
                print(f"Cleaned data preview for {table_name}:\n{df.head()}")
                print(df.info())  # Check column types

                # Write the DataFrame to the database
                df.to_sql(table_name, engine, if_exists="append", index=False)
                print(f"Loaded {file} into {table_name}.")
    except Exception as e:
        print(f"Failed to load data into {table_name}: {e}")

if __name__ == "__main__":
    # Example schema SQL for creating a table
    schema_sql = """
    CREATE TABLE IF NOT EXISTS company_situations (
    id SERIAL PRIMARY KEY,                      -- Auto-incrementing ID for unique rows
    business_id VARCHAR(20) NOT NULL,           -- Business ID (foreign key to companies table)
    type VARCHAR(100) NOT NULL,                 -- Type of situation (e.g., "Bankruptcy", "Merger")
    registration_date DATE NOT NULL,            -- Date when the situation was registered
    end_date DATE,                              -- Date when the situation ended (if applicable)
    source VARCHAR(255),                        -- Source of the situation information
    UNIQUE (business_id, type, registration_date), -- Ensure unique situations per business
    FOREIGN KEY (business_id) REFERENCES companies(business_id) -- Link to companies table
    );
    """
    
    # Create the table
    create_table(engine, schema_sql)
    
    # Load data into the table
    load_table_data(engine, "company_situations", os.path.join(processed_data_path, "company_situations"))
