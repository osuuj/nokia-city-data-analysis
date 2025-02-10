from pathlib import Path

import pandas as pd


def fix_trailing_whitespaces(file_path: Path):
    df = pd.read_csv(file_path)
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    df.to_csv(file_path, index=False)


files = [
    "etl/data/resources/01_addresses_2024-11-14.csv",
    "etl/data/resources/02_addresses_2024-11-14.csv",
    "etl/data/resources/03_addresses_2024-11-14.csv",
    "etl/data/resources/04_addresses_2024-11-14.csv",
    "etl/data/resources/05_addresses_2024-11-14.csv",
    "etl/data/resources/06_addresses_2024-11-14.csv",
    "etl/data/resources/07_addresses_2024-11-14.csv",
    "etl/data/resources/08_addresses_2024-11-14.csv",
    "etl/data/resources/09_addresses_2024-11-14.csv",
    "etl/data/resources/10_addresses_2024-11-14.csv",
    "etl/data/resources/11_addresses_2024-11-14.csv",
    "etl/data/resources/12_addresses_2024-11-14.csv",
    "etl/data/resources/13_addresses_2024-11-14.csv",
    "etl/data/resources/14_addresses_2024-11-14.csv",
    "etl/data/resources/15_addresses_2024-11-14.csv",
    "etl/data/resources/16_addresses_2024-11-14.csv",
    "etl/data/resources/17_addresses_2024-11-14.csv",
    "etl/data/resources/18_addresses_2024-11-14.csv",
    "etl/data/resources/19_addresses_2024-11-14.csv",
    "etl/data/resources/municipality_code.csv",
]

for file in files:
    fix_trailing_whitespaces(Path(file))
