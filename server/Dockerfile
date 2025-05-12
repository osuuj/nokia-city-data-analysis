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

# Install dependencies into a virtual environment
RUN python -m venv /build/venv
ENV PATH="/build/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime stage
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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

# Copy the virtual environment from the builder stage
COPY --from=builder /build/venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

# Copy only necessary application code
COPY ./backend /app/server/backend
COPY ./config /app/server/config
COPY ./db /app/server/db
COPY ./alembic /app/alembic
COPY ./alembic.ini /app/alembic.ini
COPY ./__init__.py /app/server/__init__.py

# Set ownership and secure permissions
RUN chown -R appuser:appuser /app \
    && chmod -R 755 /app

# Switch to non-root user for security
USER appuser

# Set environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
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
CMD ["/app/venv/bin/uvicorn", "server.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]