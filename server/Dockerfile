# Stage 1: Build dependencies
FROM python:3.12-slim-bookworm AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       libpq-dev \
       libc6-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies directly rather than using wheels
FROM python:3.12-slim-bookworm

LABEL maintainer="Nokia City Data Analysis Team" \
      description="Nokia City Data Analysis API Server" \
      version="1.0.0"

# Set working directory
WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --gecos "" appuser

# Install runtime dependencies and security updates
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        curl \
        libpq5 \
        ca-certificates \
        gcc \
        libpq-dev \
        libc6-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

# Copy application code - fix the directory structure
COPY ./backend /app/backend
COPY ./config /app/config
COPY ./db /app/db
COPY ./tests /app/tests
COPY ./scripts /app/scripts
COPY ./deployment /app/deployment
COPY ./__init__.py /app/__init__.py
COPY ./requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set ownership and secure permissions
RUN chown -R appuser:appuser /app \
    && chmod -R 755 /app

# Switch to non-root user for security
USER appuser

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHON_HASH_SEED=random \
    ENVIRONMENT=production \
    LOG_LEVEL=INFO \
    PORT=8000 \
    WORKERS=4

# Expose port for FastAPI
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Command to run the application with production settings
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers $WORKERS --proxy-headers --forwarded-allow-ips='*'"]