import os
import pandas as pd
import psycopg2
from psycopg2 import sql
import logging
from etl.config.config import DB_CONFIG, PROCESSED_DIR
from etl.config.logging_config import configure_logging

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

# Mapping of file parts to table names
TABLE_NAME_MAPPING = {
    "business_info": "business_info",
    "addresses": "addresses",
    "business_name_history": "business_name_history",
    "names": "names",
    "company_forms": "company_forms",
    "registered_entries": "registered_entries"
}

def create_tables(schema_path: str) -> None:
    """Create tables in the PostgreSQL database using schema.sql."""
    with open(schema_path, 'r') as file:
        schema_sql = file.read()

    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    cur.execute(schema_sql)
    conn.commit()
    cur.close()
    conn.close()
    logger.info("Tables created successfully.")

def load_csv_to_db(csv_file: str, table_name: str) -> None:
    """Load a CSV file into a PostgreSQL table."""
    df = pd.read_csv(csv_file)
    df = df.where(pd.notnull(df), None)  # Convert NaN and NaT to None
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Create insert query dynamically
    columns = list(df.columns)
    query = sql.SQL("INSERT INTO {} ({}) VALUES ({})").format(
        sql.Identifier(table_name),
        sql.SQL(', ').join(map(sql.Identifier, columns)),
        sql.SQL(', ').join(sql.Placeholder() * len(columns))
    )

    for row in df.itertuples(index=False, name=None):
        try:
            cur.execute(query, row)
        except psycopg2.IntegrityError as e:
            conn.rollback()
            logger.error(f"Integrity error loading {csv_file} into {table_name}: {e}")
        except psycopg2.DataError as e:
            conn.rollback()
            logger.error(f"Data error loading {csv_file} into {table_name}: {e}")
        else:
            conn.commit()

    cur.close()
    conn.close()
    logger.info(f"Data from {csv_file} loaded into {table_name} successfully.")

def main():
    schema_path = os.path.join(os.path.dirname(__file__), '../../db/schema.sql')
    create_tables(schema_path)
    
    # Load business_info table first
    for root, _, files in os.walk(PROCESSED_DIR):
        for file in files:
            if file.endswith('.csv') and 'business_info' in file:
                csv_file = os.path.join(root, file)
                try:
                    load_csv_to_db(csv_file, 'business_info')
                except Exception as e:
                    logger.error(f"Error loading {csv_file} into business_info: {e}")

    # Load other tables
    for root, _, files in os.walk(PROCESSED_DIR):
        for file in files:
            if file.endswith('.csv') and 'business_info' not in file:
                # Extract table name from file name
                parts = file.split('_')
                if len(parts) > 4:
                    key = parts[4].replace('.csv', '')  # Assuming the table name is the fifth part
                    table_name = TABLE_NAME_MAPPING.get(key)
                    if table_name:
                        csv_file = os.path.join(root, file)
                        try:
                            load_csv_to_db(csv_file, table_name)
                        except Exception as e:
                            logger.error(f"Error loading {csv_file} into {table_name}: {e}")
                    else:
                        logger.error(f"No table mapping found for key: {key}")
                else:
                    logger.error(f"File name {file} does not match expected pattern")

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        logger.error(f"An error occurred during the CSV loading process: {e}")
