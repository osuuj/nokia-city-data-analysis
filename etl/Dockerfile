# Stage 1: Build dependencies
FROM python:3.13.0-slim-bookworm AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    curl \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY etl/requirements.txt /build/requirements.txt

# Create a virtual environment and install dependencies
RUN python -m venv /build/venv
ENV PATH="/build/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Production image
FROM python:3.13.0-slim-bookworm

# Set metadata
LABEL maintainer="Nokia City Data Analysis Team" \
      description="ETL Pipeline for Nokia City Data" \
      version="1.0.0"

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app \
    SNAPSHOT_DATE=2025-05-11 \
    LANGUAGE=en \
    ENVIRONMENT=production \
    DB_SSL_MODE=require \
    PGSSLMODE=require

# Create app directory and user
WORKDIR /app

# Install runtime dependencies and AWS CLI
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    unzip \
    ca-certificates \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash etluser \
    && mkdir -p /app/data/resources /app/data/extracted_data /app/data/processed_data /app/data/logs \
    && chown -R etluser:etluser /app

# Copy the virtual environment from the builder stage
COPY --from=builder /build/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Copy application code and scripts
COPY --chown=etluser:etluser etl/ /app/etl/
COPY --chown=etluser:etluser etl/scripts/download_resources.sh /app/download_resources.sh
COPY --chown=etluser:etluser etl/scripts/run_etl_load.sh /app/run_etl_load.sh

# Ensure scripts are executable
RUN chmod +x /app/download_resources.sh /app/run_etl_load.sh

# Switch to non-root user for security
USER etluser

# Volume for persisting data
VOLUME ["/app/data"]

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD python -c "import sys; sys.exit(0 if open('/app/data/logs/etl_status.txt', 'a+').read().strip().endswith('success') else 1)" || exit 1

# Run the ETL process
CMD ["bash", "-c", "/app/download_resources.sh && python -m etl.pipeline.etl_run && python -m etl.pipeline.load.load_data"]