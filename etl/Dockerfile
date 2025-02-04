# Use a lightweight Python image as the base image
FROM python:3.13.0-slim-bookworm

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/etl

# Use sh to run the ETL script and then start an interactive shell
CMD ["sh", "-c", "/bin/sh"]