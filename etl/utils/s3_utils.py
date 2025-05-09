import boto3


def upload_file_to_s3(local_path, bucket, s3_key):
    """Upload a file to an S3 bucket at the specified key."""
    s3 = boto3.client("s3")
    s3.upload_file(local_path, bucket, s3_key)


def download_file_from_s3(bucket, s3_key, local_path):
    """Download a file from S3 to a local path."""
    s3 = boto3.client("s3")
    s3.download_file(bucket, s3_key, local_path)
