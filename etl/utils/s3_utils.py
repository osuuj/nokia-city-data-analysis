import boto3


def upload_file_to_s3(local_path, bucket, s3_key):
    """Upload a file to an S3 bucket at the specified key."""
    s3 = boto3.client("s3")
    s3.upload_file(local_path, bucket, s3_key)


def download_file_from_s3(bucket, s3_key, local_path):
    """Download a file from S3 to a local path."""
    s3 = boto3.client("s3")
    s3.download_file(bucket, s3_key, local_path)


def upload_cleaned_csvs_to_s3(local_cleaned_dir, bucket, s3_prefix):
    """Upload all CSV files from a local cleaned directory to S3, preserving file names and structure.

    Args:
        local_cleaned_dir (str or Path): Path to the local cleaned directory (e.g., etl/data/processed_data/cleaned/2025-05-09/en)
        bucket (str): S3 bucket name
        s3_prefix (str): S3 prefix (e.g., etl/cleaned/2025-05-09/en/)
    """
    from pathlib import Path

    s3 = boto3.client("s3")
    local_cleaned_dir = Path(local_cleaned_dir)
    for file_path in local_cleaned_dir.glob("*.csv"):
        s3_key = f"{s3_prefix}{file_path.name}"
        s3.upload_file(str(file_path), bucket, s3_key)
        print(f"Uploaded {file_path} to s3://{bucket}/{s3_key}")
