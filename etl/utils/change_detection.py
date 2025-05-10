import logging
import os
import tempfile
from pathlib import Path

import pandas as pd

from etl.utils.s3_utils import download_file_from_s3, upload_file_to_s3

USE_S3 = os.getenv("USE_S3", "false").lower() == "true"
S3_BUCKET = os.getenv("S3_BUCKET")

ENTITY_FILES = [
    "cleaned_names.csv",
    "cleaned_address_data.csv",
    "cleaned_main_business_lines.csv",
    "cleaned_companies_website.csv",
    "cleaned_company_forms.csv",
    "cleaned_company_situations.csv",
    "cleaned_registered_entries.csv",
]

SNAPSHOT_DIR = Path("etl/data/processed_data/cleaned")
PREV_DATE = os.getenv("PREV_SNAPSHOT_DATE")
CURR_DATE = os.getenv("SNAPSHOT_DATE")
LANGUAGE = os.getenv("LANGUAGE", "en")
REPORT_DIR = Path("report")
REPORT_DIR.mkdir(exist_ok=True)


def compare_snapshots(entity, prev_path, curr_path, key_col="business_id"):
    prev = pd.read_csv(prev_path)
    curr = pd.read_csv(curr_path)

    added = curr[~curr[key_col].isin(prev[key_col])]
    deleted = prev[~prev[key_col].isin(curr[key_col])]
    merged = curr.merge(prev, on=key_col, suffixes=("_curr", "_prev"))
    changed = merged[
        (merged.filter(like="_curr") != merged.filter(like="_prev")).any(axis=1)
    ]
    return added, deleted, changed


def main():
    if PREV_DATE is None or CURR_DATE is None:
        raise ValueError(
            "PREV_SNAPSHOT_DATE and SNAPSHOT_DATE must be set in the environment."
        )
    logger = logging.getLogger(__name__)
    report = []
    for entity in ENTITY_FILES:
        prev_path = SNAPSHOT_DIR / PREV_DATE / LANGUAGE / entity
        curr_path = SNAPSHOT_DIR / CURR_DATE / LANGUAGE / entity
        if USE_S3:
            # Download files from S3 to a secure temp file
            prev_s3_key = f"etl/cleaned/{PREV_DATE}/{LANGUAGE}/{entity}"
            curr_s3_key = f"etl/cleaned/{CURR_DATE}/{LANGUAGE}/{entity}"
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=f"_{PREV_DATE}_{entity}"
            ) as prev_tmp_file:
                prev_local = prev_tmp_file.name
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=f"_{CURR_DATE}_{entity}"
            ) as curr_tmp_file:
                curr_local = curr_tmp_file.name
            try:
                download_file_from_s3(S3_BUCKET, prev_s3_key, prev_local)
                download_file_from_s3(S3_BUCKET, curr_s3_key, curr_local)
            except Exception as e:
                logger.warning(f"Failed to download S3 files for {entity}: {e}")
                continue  # Skip if previous or current file doesn't exist
            prev_path, curr_path = prev_local, curr_local
        else:
            if not (prev_path.exists() and curr_path.exists()):
                continue
        added, deleted, changed = compare_snapshots(entity, prev_path, curr_path)
        report.append(
            {
                "entity": entity,
                "added": len(added),
                "deleted": len(deleted),
                "changed": len(changed),
            }
        )
        if USE_S3:
            # Save and upload detailed reports
            for df, label in zip(
                [added, deleted, changed], ["added", "deleted", "changed"]
            ):
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=f"_{entity}_{label}.csv"
                ) as out_tmp_file:
                    out_file = out_tmp_file.name
                df.to_csv(out_file, index=False)
                s3_report_key = f"etl/reports/{CURR_DATE}/{entity}_{label}.csv"
                upload_file_to_s3(out_file, S3_BUCKET, s3_report_key)
    summary_df = pd.DataFrame(report)
    if USE_S3:
        with tempfile.NamedTemporaryFile(
            delete=False, suffix="_summary.csv"
        ) as summary_tmp_file:
            summary_file = summary_tmp_file.name
        summary_df.to_csv(summary_file, index=False)
        upload_file_to_s3(
            summary_file, S3_BUCKET, f"etl/reports/{CURR_DATE}/summary.csv"
        )
    else:
        print(summary_df)


if __name__ == "__main__":
    main()
