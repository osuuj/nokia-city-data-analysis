"""ETL Database Loader.

This script is responsible for:
1. Creating database tables based on a provided SQL schema file.
2. Loading processed CSV files into the appropriate database tables.
3. Validating the database by removing duplicates and ensuring referential integrity.

It uses SQLAlchemy for database interactions and pandas for reading and handling CSV data.
"""

from pathlib import Path
from typing import Dict, List, Union

import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

from etl.config.config_loader import CONFIG, DATABASE_URL

# Define paths and configurations
processed_dir = Path(CONFIG["directory_structure"]["processed_dir"])
processed_data_path = processed_dir / "cleaned"
db_schema = Path(CONFIG["directory_structure"]["db_schema_path"])
entities = CONFIG["entities"]
print(db_schema)


def create_tables(engine: Engine, db_schema: str) -> None:
    """Create tables in the database based on the provided schema.

    Args:
        engine: SQLAlchemy engine object.
        db_schema (str): Path to the SQL schema file.

    Raises:
        ValueError: If table creation fails.
    """
    with engine.connect() as connection:
        with open(db_schema, "r") as schema_file:
            schema_sql = schema_file.read()
            statements = schema_sql.split(";")
            for statement in statements:
                if statement.strip():
                    try:
                        connection.execute(text(statement))
                    except SQLAlchemyError as e:
                        print(f"Error creating tables: {e}")
                        raise ValueError(f"Error creating tables: {e}")


def remove_duplicates(engine: Engine, table: str, unique_columns: List[str]) -> None:
    """Remove duplicate rows from the specified table based on unique columns.

    Args:
        engine: SQLAlchemy engine object.
        table (str): Name of the table to remove duplicates from.
        unique_columns (List[str]): List of columns to identify duplicates.
    """
    with engine.connect() as connection:
        query = text(
            """
            WITH duplicates AS (
                SELECT
                    ctid,
                    ROW_NUMBER() OVER (PARTITION BY :unique_columns ORDER BY ctid) AS rnum
                FROM
                    :table
            )
            DELETE FROM :table
            WHERE ctid IN (
                SELECT ctid
                FROM duplicates
                WHERE rnum > 1
            );
            """
        )
        connection.execute(
            query, {"unique_columns": ", ".join(unique_columns), "table": table}
        )
        print(f"Removed duplicate rows from table {table}.")


def load_data(
    engine: Engine,
    processed_data_path: Path,
    entities: List[Dict[str, Union[str, List[str]]]],
) -> None:
    """Load processed data into the database.

    Args:
        engine: SQLAlchemy engine object.
        processed_data_path (Path): Path to the processed data directory.
        entities (List[Dict[str, Union[str, List[str]]]]): List of entity configurations with 'name', 'table', and 'unique_columns' keys.

    Raises:
        ValueError: If data loading fails for a specific file.
    """
    for entity in entities:
        if isinstance(entity["name"], list):
            raise ValueError(
                f"Entity name should be a string, got list: {entity['name']}"
            )
        if isinstance(entity["table"], list):
            raise ValueError(
                f"Entity table should be a string, got list: {entity['table']}"
            )
        folder_path = processed_data_path / entity["name"]
        if not folder_path.exists():
            print(f"Data folder not found for entity {entity['name']}. Skipping.")
            continue

        for file_path in folder_path.glob("*.csv"):
            try:
                # Load the cleaned CSV into a DataFrame
                df = pd.read_csv(file_path)

                # Write the DataFrame to the database
                df.to_sql(entity["table"], engine, if_exists="append", index=False)
                print(f"Loaded {file_path.name} into table {entity['table']}.")
            except Exception as e:
                print(
                    f"Error loading file {file_path.name} into table {entity['table']}: {e}"
                )
                raise ValueError(
                    f"Failed to load {file_path.name} into table {entity['table']}: {e}"
                )


def validate_database(
    engine: Engine, entities: List[Dict[str, Union[str, List[str]]]]
) -> None:
    """Validate the database by removing duplicates and ensuring referential integrity.

    Args:
        engine: SQLAlchemy engine object.
        entities (List[Dict[str, Union[str, List[str]]]]): List of entity configurations with 'name', 'table', and 'unique_columns' keys.

    Raises:
        ValueError: If entity table is not a string.
    """
    print("Starting database validation...")

    # Remove duplicates from each table
    for entity in entities:
        unique_columns = entity["unique_columns"]
        if isinstance(unique_columns, str):
            unique_columns = [unique_columns]
        table = entity["table"]
        if isinstance(table, list):
            raise ValueError(f"Entity table should be a string, got list: {table}")
        remove_duplicates(engine, table, unique_columns)

    print("Database validation completed.")


if __name__ == "__main__":
    try:
        # Create the database engine
        engine = create_engine(DATABASE_URL)
        print(f"Database engine created with URL: {DATABASE_URL}")

        # Create tables
        create_tables(engine, str(db_schema))
        print("Tables created successfully.")

        # Load data into the database
        load_data(engine, processed_data_path, entities)

        # Validate the database
        validate_database(engine, entities)

        print("ETL process completed successfully.")
    except Exception as e:
        print(f"ETL process failed: {e}")
