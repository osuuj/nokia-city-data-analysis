"""ETL Database Loader.

This script is responsible for:
1. Creating database tables based on a provided SQL schema file.
2. Loading processed CSV files into the appropriate database tables.
3. Validating the database by removing duplicates and ensuring referential integrity.

It uses SQLAlchemy for database interactions and pandas for reading and handling CSV data.
"""

import logging
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from etl.config.config_loader import CONFIG, DATABASE_URL

# Enable SQLAlchemy logging
logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

# Define paths and configurations
processed_dir = Path(CONFIG["directory_structure"]["processed_dir"])
processed_data_path = processed_dir / "cleaned"
db_schema = Path(CONFIG["directory_structure"]["db_schema_path"])
entities = [
    {"table": "businesses", "file": "cleaned_names.csv"},
    {"table": "business_name_history", "file": "staging_names_old.csv"},
    {"table": "addresses", "file": "cleaned_address_data.csv"},
    {"table": "industry_classifications", "file": "cleaned_main_business_lines.csv"},
    {"table": "websites", "file": "cleaned_companies_website.csv"},
    {"table": "company_forms", "file": "cleaned_company_forms.csv"},
    {"table": "company_situations", "file": "cleaned_company_situations.csv"},
    {"table": "registered_entries", "file": "cleaned_registered_entries.csv"},
]


def create_tables(engine, schema_file):
    """Create database tables based on SQL schema.

    Args:
        engine (sqlalchemy.engine.Engine): SQLAlchemy engine object.
        schema_file (Path): Path to the SQL schema file.
    """
    try:
        with engine.connect() as conn:
            with open(schema_file, "r") as schema:
                conn.execute(text("DROP SCHEMA public CASCADE; CREATE SCHEMA public;"))
                conn.execute(text(schema.read()))
            conn.commit()
        print("✅ Tables created successfully.")
    except SQLAlchemyError as e:
        print(f"❌ Error creating tables: {e}")


def clean_data(df, table_name, engine):
    """Apply specific data cleaning rules for each table before inserting into the database.

    Args:
        df (pandas.DataFrame): DataFrame containing the data to be cleaned.
        table_name (str): Name of the table to which the data belongs.
        engine (sqlalchemy.engine.Engine): SQLAlchemy engine object.

    Returns:
        pandas.DataFrame: Cleaned DataFrame.
    """
    if table_name == "industry_classifications":
        # Remove rows where business_id does not exist in the businesses table
        business_ids_in_db = set(
            pd.read_sql("SELECT business_id FROM businesses", engine)["business_id"]
        )
        df = df[df["business_id"].isin(business_ids_in_db)]

        # Keep industry NULL (do not replace)
        df["industry"] = df["industry"].where(pd.notna(df["industry"]), None)

    if table_name == "company_forms":
        # Remove rows where business_id does not exist in the businesses table
        business_ids_in_db = set(
            pd.read_sql("SELECT business_id FROM businesses", engine)["business_id"]
        )
        df = df[df["business_id"].isin(business_ids_in_db)]

        # Remove duplicates by keeping only the latest version
        df = df.sort_values(
            by=["business_id", "business_form", "version"],
            ascending=[True, True, False],
        )
        df = df.drop_duplicates(subset=["business_id", "business_form"], keep="first")

    if table_name == "registered_entries":
        # Remove rows where business_id does not exist in the businesses table
        business_ids_in_db = set(
            pd.read_sql("SELECT business_id FROM businesses", engine)["business_id"]
        )
        df = df[df["business_id"].isin(business_ids_in_db)]

    return df


def load_csv_to_db(engine, table_name, file_path):
    """Load cleaned CSV data into PostgreSQL.

    Args:
        engine (sqlalchemy.engine.Engine): SQLAlchemy engine object.
        table_name (str): Name of the table to load data into.
        file_path (Path): Path to the CSV file to be loaded.
    """
    try:
        df = pd.read_csv(file_path)
        df.drop_duplicates(inplace=True)

        # Apply cleaning rules before insertion
        df = clean_data(df, table_name, engine)

        df.to_sql(table_name, engine, if_exists="append", index=False)
        print(f"✅ Loaded {file_path} into table {table_name}.")
    except Exception as e:
        print(f"❌ Error loading {file_path} into {table_name}: {e}")


def load_data():
    """ETL process to load cleaned CSVs into the database."""
    try:
        engine = create_engine(DATABASE_URL)
        create_tables(engine, db_schema)

        # Load all tables
        for entity in entities:
            file_path = processed_data_path / entity["file"]
            if file_path.exists():
                load_csv_to_db(engine, entity["table"], file_path)
            else:
                print(f"⚠️ File {entity['file']} not found. Skipping.")

        print("✅ ETL process completed successfully.")
    except SQLAlchemyError as e:
        print(f"❌ Database connection error: {e}")


if __name__ == "__main__":
    load_data()
