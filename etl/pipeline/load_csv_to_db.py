import os
import pandas as pd
from sqlalchemy import create_engine

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Database connection details
DB_USER = os.getenv('POSTGRES_USER')
DB_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DB_NAME = os.getenv('POSTGRES_DB')
DB_HOST = 'db'  # Docker service name

# Create database engine
engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:5432/{DB_NAME}')

# Path to CSV file
csv_file_path = './etl/data/your_data.csv'

# Load CSV into DataFrame
df = pd.read_csv(csv_file_path)

# Load DataFrame into PostgreSQL
df.to_sql('your_table_name', engine, if_exists='replace', index=False)

print("CSV data loaded into PostgreSQL database successfully.")
