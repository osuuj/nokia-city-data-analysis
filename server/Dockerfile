# Stage 1: Build dependencies
FROM python:3.13.0-slim-bookworm as builder

WORKDIR /build

# Install build dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# Stage 2: Runtime
FROM python:3.13.0-slim-bookworm

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

# Copy dependencies from builder stage
COPY --from=builder /build/wheels /wheels
RUN pip install --no-cache-dir /wheels/* \
    && rm -rf /wheels

# Copy application code - split for better layer caching
COPY ./server/backend ./app/server/backend
COPY ./server/config ./app/server/config
COPY ./server/db ./app/server/db
COPY ./server/tests ./app/server/tests
COPY ./server/scripts ./app/server/scripts
COPY ./server/deployment ./app/server/deployment

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
CMD ["sh", "-c", "uvicorn server.backend.main:app --host 0.0.0.0 --port $PORT --workers $WORKERS --proxy-headers --forwarded-allow-ips='*'"]