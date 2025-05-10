#!/usr/bin/env python3
"""Script to compare the SQL and SQLAlchemy implementations of get_business_data_by_city.

Usage:
    python -m server.scripts.compare_implementations city_name

Example:
    python -m server.scripts.compare_implementations Helsinki
"""

import asyncio
import json
import sys
import time

# Add the parent directory to the path so we can import server modules
from pathlib import Path
from typing import List

import uvloop  # pyright: ignore[reportMissingImports]

# Add the server directory to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from server.backend.database import get_db  # pyright: ignore[reportMissingImports]
from server.backend.services.company_service import (  # pyright: ignore[reportMissingImports]
    get_business_data_by_city,
    get_business_data_by_city_raw_sql,
)


async def get_available_cities() -> List[str]:
    """Get a list of available cities for testing."""
    try:
        async for db in get_db():
            query = (
                "SELECT DISTINCT city FROM addresses WHERE city IS NOT NULL LIMIT 10"
            )
            result = await db.execute(query)
            return [row[0] for row in result]

        # If we reach here, no database session was obtained
        return []
    except Exception as e:
        print(f"Error getting available cities: {e}")
        return []


async def compare_implementations(city: str) -> None:
    """Compare the SQL and SQLAlchemy implementations for a city."""
    print(f"Comparing implementations for city: {city}")

    # Get database session
    async for db in get_db():
        # Measure performance of SQL implementation
        start_time = time.time()
        sql_results = await get_business_data_by_city_raw_sql(db, city)
        sql_time = time.time() - start_time

        # Measure performance of SQLAlchemy implementation
        start_time = time.time()
        sqlalchemy_results = await get_business_data_by_city(db, city)
        sqlalchemy_time = time.time() - start_time

        # Convert to dictionaries for comparison
        sql_dicts = [result.dict() for result in sql_results]
        sqlalchemy_dicts = [result.dict() for result in sqlalchemy_results]

        # Compare results
        print(f"SQL count: {len(sql_dicts)}, SQLAlchemy count: {len(sqlalchemy_dicts)}")
        print(f"SQL time: {sql_time:.4f}s, SQLAlchemy time: {sqlalchemy_time:.4f}s")

        # Speed difference
        if sql_time > 0:
            speed_diff = (sqlalchemy_time - sql_time) / sql_time * 100
            print(
                f"Speed difference: {speed_diff:.2f}% ({'slower' if speed_diff > 0 else 'faster'})"
            )

        # Check if results are the same length
        if len(sql_dicts) != len(sqlalchemy_dicts):
            print("ERROR: Result counts don't match!")
            return

        # Sample comparison of a few records
        sample_size = min(3, len(sql_dicts))
        for i in range(sample_size):
            sql = sql_dicts[i]
            sqlalchemy = sqlalchemy_dicts[i]

            # Check key fields
            matches = all(
                [
                    sql["business_id"] == sqlalchemy["business_id"],
                    sql["company_name"] == sqlalchemy["company_name"],
                    sql["street"] == sqlalchemy["street"],
                    sql["city"] == sqlalchemy["city"],
                ]
            )

            print(f"Record {i} comparison: {'✅ Match' if matches else '❌ Mismatch'}")

            if not matches:
                print("SQL:", json.dumps(sql, indent=2))
                print("SQLAlchemy:", json.dumps(sqlalchemy, indent=2))


async def main() -> None:
    """Run the comparison."""
    # Check if city was provided as argument
    if len(sys.argv) > 1:
        city = sys.argv[1]
        await compare_implementations(city)
    else:
        # Get available cities and compare the first one
        cities = await get_available_cities()
        if not cities:
            print("No cities found in the database.")
            return

        print(f"Available cities: {', '.join(cities)}")
        await compare_implementations(cities[0])


if __name__ == "__main__":
    # Use uvloop for better performance
    uvloop.install()
    asyncio.run(main())
