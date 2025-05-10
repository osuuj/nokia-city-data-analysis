"""ETL Database Loader.

This script is responsible for:
1. Creating database tables based on a provided SQL schema file.
2. Loading processed CSV files into the appropriate database tables.
3. Validating the database by removing duplicates and ensuring referential integrity.

It uses SQLAlchemy for database interactions and pandas for reading and handling CSV data.
"""

import logging
import os
import tempfile
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from etl.config.config_loader import CONFIG, DATABASE_URL
from etl.utils.s3_utils import download_file_from_s3

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

USE_S3 = os.getenv("USE_S3", "false").lower() == "true"
S3_BUCKET = os.getenv("S3_BUCKET")
SNAPSHOT_DATE = CONFIG.get("snapshot_date")
LANGUAGE = CONFIG.get("language")


def get_cleaned_csv_path(entity_file):
    if USE_S3:
        s3_key = f"etl/cleaned/{SNAPSHOT_DATE}/{LANGUAGE}/{entity_file}"
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=f"_{entity_file}"
        ) as tmp_file:
            local_path = tmp_file.name
        download_file_from_s3(S3_BUCKET, s3_key, local_path)
        return local_path
    else:
        if SNAPSHOT_DATE is None or LANGUAGE is None:
            raise ValueError(
                "SNAPSHOT_DATE and LANGUAGE must be set in the config or environment."
            )
        return (
            Path(CONFIG["directory_structure"]["processed_dir"])
            / "cleaned"
            / SNAPSHOT_DATE
            / LANGUAGE
            / entity_file
        )


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


def clean_data(df: pd.DataFrame, table_name: str, engine) -> pd.DataFrame:
    """Apply specific data cleaning rules for each table before inserting into the database.

    Args:
        df (pandas.DataFrame): DataFrame containing the data to be cleaned.
        table_name (str): Name of the table to which the data belongs.
        engine (sqlalchemy.engine.Engine): SQLAlchemy engine object.

    Returns:
        pandas.DataFrame: Cleaned DataFrame.
    """
    if table_name == "industry_classifications":
        business_ids_in_db = pd.read_sql("SELECT business_id FROM businesses", engine)[
            "business_id"
        ].tolist()
        df = pd.DataFrame(df[df["business_id"].isin(business_ids_in_db)])

        # Keep industry NULL (do not replace)
        df.loc[:, "industry"] = df["industry"].where(pd.notna(df["industry"]), None)

    if table_name == "company_forms":
        business_ids_in_db = pd.read_sql("SELECT business_id FROM businesses", engine)[
            "business_id"
        ].tolist()
        df = pd.DataFrame(df[df["business_id"].isin(business_ids_in_db)])

        # Remove duplicates by keeping only the latest version
        df = df.sort_values(
            by=["business_id", "business_form", "version"],
            ascending=[True, True, False],
        )
        df = df.drop_duplicates(subset=["business_id", "business_form"], keep="first")

    if table_name == "registered_entries":
        business_ids_in_db = pd.read_sql("SELECT business_id FROM businesses", engine)[
            "business_id"
        ].tolist()
        df = pd.DataFrame(df[df["business_id"].isin(business_ids_in_db)])

    return pd.DataFrame(df)


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
        # Add snapshot_date column
        df["snapshot_date"] = SNAPSHOT_DATE
        # Apply cleaning rules before insertion
        df = clean_data(df, table_name, engine)
        df.to_sql(table_name, engine, if_exists="append", index=False)
        print(f"✅ Loaded {file_path} into table {table_name}.")
    except Exception as e:
        print(f"❌ Error loading {file_path} into {table_name}: {e}")


def load_data():
    """ETL process to load cleaned CSVs into the database."""
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_size=10,  # ✅ Keeps up to 10 connections open
            max_overflow=5,  # ✅ Allows 5 extra temporary connections
            pool_timeout=30,  # ✅ Waits 30 sec before failing if no connection is available
            pool_recycle=1800,  # ✅ Recycles connections every 30 min to prevent stale connections
            echo=False,  # ❌ Set to True for debugging, but disable in production
        )
        create_tables(engine, db_schema)

        # Load all tables
        for entity in entities:
            file_path = get_cleaned_csv_path(entity["file"])
            if Path(file_path).exists():
                load_csv_to_db(engine, entity["table"], file_path)
            else:
                print(f"⚠️ File {entity['file']} not found. Skipping.")

        print("✅ ETL process completed successfully.")
    except SQLAlchemyError as e:
        print(f"❌ Database connection error: {e}")


if __name__ == "__main__":
    load_data()
