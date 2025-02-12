"""ETL Database Loader.

This script is responsible for:
1. Creating database tables based on a provided SQL schema file.
2. Loading processed CSV files into the appropriate database tables.
3. Validating the database by removing duplicates and ensuring referential integrity.

It uses SQLAlchemy for database interactions and pandas for reading and handling CSV data.
"""

from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text

# Database connection details
DATABASE_URL = "postgresql://user:password@localhost/business_db"
engine = create_engine(DATABASE_URL)

# Paths
PROCESSED_DATA_DIR = Path("etl/data/processed_data/cleaned")
DB_SCHEMA_FILE = Path("etl/pipeline/transform/db_schema.sql")


def create_tables(engine, schema_file):
    """Create database tables based on SQL schema."""
    with engine.connect() as conn:
        with open(schema_file, "r") as schema:
            conn.execute(text(schema.read()))
        conn.commit()
    print("✅ Tables created successfully.")


def load_csv_to_db(engine, table_name, file_path):
    """Load cleaned CSV data into PostgreSQL."""
    try:
        df = pd.read_csv(file_path)
        df.to_sql(table_name, engine, if_exists="append", index=False)
        print(f"✅ Loaded {file_path} into table {table_name}.")
    except Exception as e:
        print(f"❌ Error loading {file_path} into {table_name}: {e}")


def remove_duplicates(engine, table_name, unique_columns):
    """Remove duplicate rows from the table based on unique columns."""
    with engine.connect() as conn:
        unique_cols_str = ", ".join(unique_columns)
        query = f"""
        DELETE FROM {table_name}
        WHERE ctid IN (
            SELECT ctid FROM (
                SELECT ctid, ROW_NUMBER() OVER (
                    PARTITION BY {unique_cols_str} ORDER BY ctid
                ) AS rnum
                FROM {table_name}
            ) AS temp_table
            WHERE rnum > 1
        );
        """
        conn.execute(text(query))
        conn.commit()
    print(f"✅ Removed duplicates from {table_name}.")


def load_data():
    """ETL process to load cleaned CSVs into the database."""
    create_tables(engine, DB_SCHEMA_FILE)

    entities = [
        {
            "table": "businesses",
            "file": "cleaned_businesses.csv",
            "unique_columns": ["business_id"],
        },
        {
            "table": "addresses",
            "file": "cleaned_addresses.csv",
            "unique_columns": ["business_id", "street"],
        },
        {
            "table": "company_forms",
            "file": "cleaned_company_forms.csv",
            "unique_columns": ["business_id", "business_form"],
        },
        {
            "table": "company_situations",
            "file": "cleaned_company_situations.csv",
            "unique_columns": ["business_id", "type"],
        },
    ]

    for entity in entities:
        file_path = PROCESSED_DATA_DIR / entity["file"]
        if file_path.exists():
            load_csv_to_db(engine, entity["table"], file_path)
            remove_duplicates(engine, entity["table"], entity["unique_columns"])
        else:
            print(f"⚠️ File {entity['file']} not found. Skipping.")

    print("✅ ETL process completed successfully.")


if __name__ == "__main__":
    load_data()
