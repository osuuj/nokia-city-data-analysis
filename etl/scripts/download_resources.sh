#!/bin/bash
set -e

if [ "$DOWNLOAD_RESOURCES_FROM_S3" = "true" ]; then
  echo "Downloading resources from S3 bucket: $S3_BUCKET"
  aws s3 sync s3://$S3_BUCKET/resources/ etl/data/resources/
else
  echo "Using local resources directory."
fi