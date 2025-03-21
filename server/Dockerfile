# Use a lightweight Python image as the base image
FROM python:3.13.0-slim-bookworm

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code/server

# Expose the port for FastAPI
EXPOSE 8000

CMD ["uvicorn", "server.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]