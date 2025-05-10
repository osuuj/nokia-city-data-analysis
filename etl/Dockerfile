# Use a lightweight Python image as the base image
FROM python:3.13.0-slim-bookworm

WORKDIR /code

COPY etl/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Install AWS CLI v2
RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

COPY . /code

COPY etl/scripts/download_resources.sh /download_resources.sh
RUN chmod +x /download_resources.sh

# ENTRYPOINT ["/bin/bash", "-c", "/download_resources.sh && python -m etl.pipeline.etl_run"]

# Run the ETL script and then the load data script, and start an interactive shell
CMD ["sh", "-c", "python -m etl.pipeline.etl_run && python -m etl.pipeline.load.load_data"]