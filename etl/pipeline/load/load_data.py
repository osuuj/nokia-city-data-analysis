import os
from typing import Dict, List

import pandas as pd
from sqlalchemy import Engine, create_engine, exc, text

from etl.config.config_loader import CONFIG, DATABASE_URL

# Define paths and configurations
processed_dir = CONFIG["directory_structure"]["processed_dir"]
processed_data_path = os.path.join(processed_dir, "cleaned")
db_schema = CONFIG["directory_structure"]["db_schema_path"]
entities = CONFIG["entities"]


def create_tables(engine: Engine, schema_file: str) -> None:
    """Create database tables from the schema SQL file.

    Args:
        engine (Engine): SQLAlchemy database engine.
        schema_file (str): Path to the SQL schema file.

    Raises:
        IOError: If the schema file cannot be read.
        SQLAlchemyError: If an error occurs during table creation.
    """
    try:
        with open(schema_file, "r") as file:
            schema_sql = file.read()

        with engine.connect() as connection:
            for statement in schema_sql.split(";"):
                if statement.strip():
                    connection.execute(text(statement))
        print("Tables created successfully.")
    except IOError as e:
        print(f"Error reading schema file: {e}")
        raise IOError(f"Error reading schema file: {e}")  # Raise IOError explicitly
    except exc.SQLAlchemyError as e:
        print(f"Error creating tables: {e}")
        raise exc.SQLAlchemyError(
            f"Error creating tables: {e}"
        )  # Raise SQLAlchemyError explicitly


def load_data(
    engine: Engine, processed_data_path: str, entities: List[Dict[str, str]]
) -> None:
    """Load processed CSV files into the database.

    Args:
        engine (Engine): SQLAlchemy database engine.
        processed_data_path (str): Path to the processed data directory.
        entities (List[Dict[str, str]]): List of entity configurations with 'name' and 'table' keys.

    Raises:
        Exception: If any error occurs during data loading.
    """
    try:
        for entity in entities:
            folder_path = os.path.join(processed_data_path, entity["name"])
            if not os.path.exists(folder_path):
                print(f"Data folder not found for entity {entity['name']}. Skipping.")
                continue

            for file in os.listdir(folder_path):
                if file.endswith(".csv"):
                    file_path = os.path.join(folder_path, file)
                    try:
                        # Load the CSV into a DataFrame
                        df = pd.read_csv(file_path)

                        # Write the DataFrame to the database
                        df.to_sql(
                            entity["table"], engine, if_exists="append", index=False
                        )
                        print(f"Loaded {file} into table {entity['table']}.")
                    except Exception as e:
                        print(
                            f"Error loading file {file} into table {entity['table']}: {e}"
                        )
                        raise Exception(
                            f"Error loading file {file} into table {entity['table']}: {e}"
                        )
    except Exception as e:
        print(f"Failed to load data: {e}")
        raise Exception(f"Failed to load data: {e}")


if __name__ == "__main__":
    # Create the database engine
    try:
        engine = create_engine(DATABASE_URL)

        # Step 1: Create tables
        create_tables(engine, db_schema)

        # Step 2: Load data
        load_data(engine, processed_data_path, entities)
    except Exception as e:
        print(f"ETL process failed: {e}")
        raise Exception(f"ETL process failed: {e}")
