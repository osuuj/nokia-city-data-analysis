# Use a lightweight Python image as the base image
FROM python:3.13.0-slim-bookworm

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/etl

COPY scripts/download_resources.sh /download_resources.sh
RUN chmod +x /download_resources.sh

ENTRYPOINT ["/bin/bash", "-c", "/download_resources.sh && python etl/pipeline/etl_run.py"]

# Run the ETL script and then the load data script, and start an interactive shell
CMD ["sh", "-c", "python etl/pipeline/etl_run.py && python etl/pipeline/load/load_data.py"]