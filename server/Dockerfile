FROM python:3.12-slim-bookworm AS builder

WORKDIR /app
COPY requirements.txt .

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    python3-dev \
    ca-certificates \
    openssl \
    && python -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip \
    && /opt/venv/bin/pip install -r requirements.txt \
    && apt-get purge -y --auto-remove gcc \
    && rm -rf /root/.cache /var/lib/apt/lists/*

# Stage 2: Final runtime
FROM python:3.12-slim-bookworm

WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install SSL certificates and runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libpq5 \
    openssl \
    curl \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && adduser --disabled-password --gecos "" appuser

# Copy all application files
COPY ./backend /app/server/backend
COPY ./config /app/server/config
COPY ./db /app/server/db
COPY ./alembic /app/alembic
COPY ./alembic.ini /app/alembic.ini
COPY ./__init__.py /app/server/__init__.py

# Create script to parse DATABASE_CREDENTIALS if provided
RUN echo '#!/bin/bash\n\
# Script to handle database credentials from AWS Secrets Manager\n\
if [ -n "$DATABASE_CREDENTIALS" ]; then\n\
  echo "Processing database credentials from secret..."\n\
  # Extract values from JSON\n\
  export POSTGRES_USER=$(echo $DATABASE_CREDENTIALS | jq -r .username)\n\
  export POSTGRES_PASSWORD=$(echo $DATABASE_CREDENTIALS | jq -r .password)\n\
  export POSTGRES_HOST=$(echo $DATABASE_CREDENTIALS | jq -r .host)\n\
  export POSTGRES_PORT=$(echo $DATABASE_CREDENTIALS | jq -r .port)\n\
  echo "Database connection configured from secret"\n\
fi\n\
\n\
# Start the application\n\
exec "$@"\n' > /app/entrypoint.sh && \
chmod +x /app/entrypoint.sh && \
apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

RUN chown -R appuser:appuser /app && chmod -R 755 /app
USER appuser

ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHON_HASH_SEED=random \
    ENVIRONMENT=production \
    LOG_LEVEL=INFO \
    PORT=8000 \
    WORKERS=4 \
    DB_SSL_MODE=require

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "server.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]