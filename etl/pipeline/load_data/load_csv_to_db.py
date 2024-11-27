import os
import sys
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
import logging
from etl.config.config import DB_CONFIG, get_supported_cities, get_city_paths
from etl.config.logging_config import configure_logging

# Add the root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

# Configure logging
configure_logging()

# Set SQLAlchemy logging level to CRITICAL to suppress detailed SQL parameter logs
logging.getLogger('sqlalchemy.engine').setLevel(logging.CRITICAL)

# Create database engine
engine = create_engine(f'postgresql://{DB_CONFIG["user"]}:{DB_CONFIG["password"]}@{DB_CONFIG["host"]}:{DB_CONFIG["port"]}/{DB_CONFIG["dbname"]}')

def load_table(csv_file_path, table_name, conflict_columns):
    """Load a CSV file into the specified PostgreSQL table with conflict handling."""
    df = pd.read_csv(csv_file_path)
    try:
        df.drop_duplicates(inplace=True)
        with engine.connect() as conn:
            for i in range(0, len(df), 1000):
                batch_df = df.iloc[i:i+1000]
                batch_df.to_sql(table_name, conn, if_exists='append', index=False, method='multi')
                insert_query = f"""
                    INSERT INTO {table_name} ({', '.join(batch_df.columns)})
                    VALUES {', '.join([str(tuple(x)) for x in batch_df.to_records(index=False)])}
                    ON CONFLICT ({', '.join(conflict_columns)}) DO NOTHING
                """
                conn.execute(text(insert_query))
        logging.info(f"Loaded {len(df)} rows into {table_name} from {os.path.basename(csv_file_path)}")
    except IntegrityError as e:
        logging.error(f"Error loading {os.path.basename(csv_file_path)} into {table_name}: {e.orig.pgerror}")

def load_csv_to_db(city: str):
    """Load CSV files for a given city into the PostgreSQL database."""
    city_paths = get_city_paths(city)
    cleaned_dir = city_paths['cleaned_dir']

    for csv_file in os.listdir(cleaned_dir):
        if csv_file.endswith('.csv') and 'business_info' in csv_file:
            csv_file_path = os.path.join(cleaned_dir, csv_file)
            load_table(csv_file_path, 'business_info', ['business_id'])

    table_order = [
        ('names_table', ['business_id', 'name', 'registration_date']),
        ('addresses_table', ['business_id', 'address_type', 'address', 'post_code']),
        ('company_forms_table', ['business_id', 'description', 'registration_date']),
        ('registered_entries_table', ['business_id', 'description', 'registration_date']),
        ('business_name_history', ['business_id', 'previous_name', 'change_date'])
    ]

    for table_name, conflict_columns in table_order:
        for csv_file in os.listdir(cleaned_dir):
            if csv_file.endswith('.csv') and table_name in csv_file:
                csv_file_path = os.path.join(cleaned_dir, csv_file)
                load_table(csv_file_path, table_name, conflict_columns)

def main():
    supported_cities = get_supported_cities()
    for city in supported_cities:
        logging.info(f"Loading data for city: {city}")
        load_csv_to_db(city)

if __name__ == "__main__":
    main()
