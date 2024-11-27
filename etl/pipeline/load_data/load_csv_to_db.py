import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Database connection details
DB_CONFIG = {
    'dbname': 'your_database',
    'user': 'your_user',
    'password': 'your_password',
    'host': 'localhost',
    'port': 5432
}

def load_csv_to_db(file_path, table_name, conn):
    """
    Load CSV data into a database table.
    """
    df = pd.read_csv(file_path)
    columns = list(df.columns)
    data = df.values.tolist()
    placeholders = ', '.join([f"%s" for _ in columns])
    
    with conn.cursor() as cursor:
        sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES {placeholders} ON CONFLICT DO NOTHING"
        execute_values(cursor, sql, data)

def main():
    files_and_tables = {
        "cleaned_NOKIA_part_1_addresses.csv": "addresses",
        "cleaned_NOKIA_part_1_business_info.csv": "business_info",
        "cleaned_NOKIA_part_1_business_name_history.csv": "business_name_history",
        "cleaned_NOKIA_part_1_company_forms.csv": "company_forms",
        "cleaned_NOKIA_part_1_names.csv": "names",
        "cleaned_NOKIA_part_1_registered_entries.csv": "registered_entries",
    }
    
    conn = psycopg2.connect(**DB_CONFIG)
    
    try:
        for file, table in files_and_tables.items():
            print(f"Loading {file} into {table}...")
            load_csv_to_db(file, table, conn)
            print(f"Loaded {file} successfully.")
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    main()
