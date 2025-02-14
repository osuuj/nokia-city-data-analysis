import logging
import time

import pandas as pd
from sqlalchemy import create_engine, text

from etl.config.config_loader import DATABASE_URL

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")


# Database connection
engine = create_engine(DATABASE_URL)

# Define the queries to test
queries = {
    "Old Query": """
     SELECT
            a.business_id,
            a.street,
            a.building_number,
            COALESCE(a.entrance, '') AS entrance,
            CAST(a.postal_code AS TEXT) AS postal_code,
            a.city,
            CAST(a.latitude_wgs84 AS TEXT) AS latitude_wgs84,
            CAST(a.longitude_wgs84 AS TEXT) AS longitude_wgs84,
            a.address_type,
            CAST(a.active AS TEXT) AS active,
            b.company_name,
            b.company_type,
            COALESCE(ic.industry_description, '') AS industry_description,
            COALESCE(w.website, '') AS website  -- ✅ Handles NULL values in SQL
        FROM addresses a
        JOIN businesses b ON a.business_id = b.business_id
        LEFT JOIN LATERAL (
            SELECT industry_description
            FROM industry_classifications ic
            WHERE ic.business_id = a.business_id
            ORDER BY ic.registration_date DESC
            LIMIT 1
        ) ic ON true
        LEFT JOIN LATERAL (
            SELECT website
            FROM websites w
            WHERE w.business_id = a.business_id
            ORDER BY w.registration_date DESC
            LIMIT 1
        ) w ON true
        WHERE a.city = :city;
    """
}


def benchmark_query(query_name, query, params):
    """Runs a query and measures execution time."""
    logging.info(f"Running {query_name}...")

    with engine.connect() as conn:
        start_time = time.time()
        result = conn.execute(text(query), params)
        execution_time = time.time() - start_time

    return execution_time, result.fetchall()


def run_benchmarks(city):
    """Runs all benchmarks and saves results to CSV."""
    results = []

    for name, query in queries.items():
        exec_time, _ = benchmark_query(name, query, {"city": city})
        results.append({"Query Type": name, "Execution Time (seconds)": exec_time})
        logging.info(f"{name} took {exec_time:.4f} seconds")

    # Save results to CSV
    df = pd.DataFrame(results)
    df.to_csv("query_benchmark_results.csv", index=False)
    logging.info("✅ Benchmark results saved to query_benchmark_results.csv")


if __name__ == "__main__":
    test_city = "Helsinki"  # Change this to any city to test
    run_benchmarks(test_city)
