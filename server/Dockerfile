FROM python:3.12-slim-bookworm AS builder

WORKDIR /app
COPY requirements.txt .

# Add build date to bust cache
ARG BUILD_DATE=unknown
LABEL build_date=$BUILD_DATE

# Install build dependencies
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

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libpq5 \
    openssl \
    curl \
    postgresql-client \
    jq \
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

# Create entrypoint.sh
RUN cat <<'EOF' > /app/entrypoint.sh
#!/bin/bash

# Handle database credentials from RDS managed secret
if [ -n "$DATABASE_CREDENTIALS" ]; then
  echo "Processing RDS managed secret..."
  export POSTGRES_USER=$(echo $DATABASE_CREDENTIALS | jq -r .username)
  export POSTGRES_PASSWORD=$(echo $DATABASE_CREDENTIALS | jq -r .password)
  echo "✅ Username and password set from RDS managed secret"
else
  echo "❌ DATABASE_CREDENTIALS not found in RDS managed secret"
  exit 1
fi

# Get connection parameters from GitHub secrets
: "${POSTGRES_HOST:?Missing POSTGRES_HOST from GitHub secrets}"
: "${POSTGRES_PORT:?Missing POSTGRES_PORT from GitHub secrets}"
: "${POSTGRES_DB:?Missing POSTGRES_DB from GitHub secrets}"

echo "🔌 DB Host: $POSTGRES_HOST"
echo "🔌 DB Port: $POSTGRES_PORT"
echo "🔌 DB Name: $POSTGRES_DB"

# Test database connection
echo "Testing direct database connection with psql..."
PGPASSWORD=$POSTGRES_PASSWORD PGSSLMODE=require \
  psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB \
  -c "SELECT 1 as connection_test;" || echo "Direct psql connection failed!"

# Start app
exec "$@"
EOF

RUN chmod +x /app/entrypoint.sh \
    && chown -R appuser:appuser /app \
    && chmod -R 755 /app
USER appuser

ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHON_HASH_SEED=random \
    ENVIRONMENT=production \
    LOG_LEVEL=DEBUG \
    PORT=8000 \
    WORKERS=4 \
    DB_SSL_MODE=require \
    PGSSLMODE=require

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "server.backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]
