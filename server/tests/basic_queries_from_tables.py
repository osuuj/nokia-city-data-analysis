import os
import re

import pandas as pd
from sqlalchemy import create_engine, text

from server.backend.config import DATABASE_URL

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)


def run_query(query: str):
    """Execute a SQL query and return the results as a Pandas DataFrame.

    Args:
        query (str): The SQL query to execute.

    Returns:
        pd.DataFrame: Query results in a DataFrame format.
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text(query))
            df = pd.DataFrame(result.fetchall(), columns=list(result.keys()))
        return df
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def save_to_csv(table_name: str, query: str, output_dir: str):
    """Run a query for a specific table, save the results to a CSV file, and print the file's size and dimensions.

    Args:
        table_name (str): Name of the table being queried.
        query (str): SQL query to fetch the data.
        output_dir (str): Directory to save the CSV files.
    """
    df = run_query(query)
    if df is not None:
        # Save to CSV
        output_file = os.path.join(output_dir, f"{table_name}.csv")
        df.to_csv(output_file, index=False)

        # Get file size and dimensions
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # Size in MB
        print(f"Saved {table_name} to {output_file}")
        print(f"File size: {file_size:.2f} MB")
        print(f"Dimensions: {df.shape[0]} rows, {df.shape[1]} columns")
    else:
        print(f"Failed to fetch or save data for {table_name}.")


def parse_schema_and_generate_queries(schema_file: str):
    """Parse the schema file to extract table names and their columns, and generate SQL SELECT queries for all tables.

    Args:
        schema_file (str): Path to the schema file.

    Returns:
        dict: A dictionary with table names as keys and SQL queries as values.
    """
    with open(schema_file, "r") as file:
        schema_content = file.read()

    table_queries = {}
    table_regex = r"CREATE TABLE IF NOT EXISTS (\w+) \((.*?)\);"
    matches = re.findall(table_regex, schema_content, re.S)

    for table_name, columns in matches:
        # Extract column names
        column_lines = [line.strip() for line in columns.splitlines()]
        columns_list = [
            line.split()[0]
            for line in column_lines
            if line
            and not line.startswith("--")
            and not re.match(r"(PRIMARY|FOREIGN|CONSTRAINT)", line, re.I)
        ]

        # Build SELECT query for the table
        columns_str = ", ".join(columns_list)
        query = f"SELECT {columns_str} FROM {table_name}"
        table_queries[table_name] = query

    return table_queries


if __name__ == "__main__":
    # Path to the schema file
    schema_file = "server/db/schema.sql"

    # Parse the schema and generate queries
    table_queries = parse_schema_and_generate_queries(schema_file)

    # Output directory for CSV files
    output_directory = "server/tests/output_csvs"
    os.makedirs(output_directory, exist_ok=True)  # Ensure the directory exists

    # Loop through the queries and save data to CSV files
    for table_name, query in table_queries.items():
        print(f"Processing table: {table_name}")
        save_to_csv(table_name, query, output_directory)
