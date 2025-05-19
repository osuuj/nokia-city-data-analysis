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

# ✅ Write patch_ssl.py cleanly
RUN cat <<EOF > /app/patch_ssl.py
#!/usr/bin/env python3
import os
import re

def patch_database_file():
    """Patch the database.py file to modify SSL settings"""
    file_path = "server/backend/database.py"

    with open(file_path, "r") as f:
        content = f.read()

    pattern = r"# Only enable SSL in production or if explicitly set\\nif settings\\.ENVIRONMENT == \\\"production\\\" or settings\\.DB_SSL_MODE == \\\"require\\\":\\n    # Enable SSL\\n    connect_args\\[\\"ssl\\"\\] = True\\n    logger\\.info\\(\\"SSL enabled for database connection\\"\)"

    replacement = '''# Check SSL mode setting\nimport ssl\nif settings.DB_SSL_MODE == "disable" or os.environ.get("PGSSLMODE") == "disable":\n    connect_args["ssl"] = False\n    logger.info("SSL disabled for database connection")\nelif settings.ENVIRONMENT == "production" or settings.DB_SSL_MODE == "require":\n    ssl_ctx = ssl.create_default_context()\n    ssl_ctx.check_hostname = False\n    ssl_ctx.verify_mode = ssl.CERT_NONE\n    connect_args["ssl"] = ssl_ctx\n    logger.info("SSL enabled with CERT_NONE")'''

    new_content = re.sub(pattern, replacement, content)

    with open(file_path, "w") as f:
        f.write(new_content)

    print(f"Patched {file_path} to fix SSL configuration")

if __name__ == "__main__":
    patch_database_file()
EOF

# ✅ Create entrypoint.sh cleanly
RUN cat <<'EOF' > /app/entrypoint.sh
#!/bin/bash

# Apply SSL patch first
python /app/patch_ssl.py

# Handle database credentials from AWS Secrets Manager
if [ -n "$DATABASE_CREDENTIALS" ]; then
  echo "Processing database credentials from secret..."
  export POSTGRES_USER=$(echo $DATABASE_CREDENTIALS | jq -r .username)
  export POSTGRES_PASSWORD=$(echo $DATABASE_CREDENTIALS | jq -r .password)
  export POSTGRES_HOST=$(echo $DATABASE_CREDENTIALS | jq -r .host)
  export POSTGRES_PORT=$(echo $DATABASE_CREDENTIALS | jq -r .port)
  echo "Database connection configured from secret"
  echo "Testing direct database connection with psql..."
  PGPASSWORD=$POSTGRES_PASSWORD PGSSLMODE=disable psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $DATABASE_NAME -c "SELECT 1 as connection_test;" || echo "Direct psql connection failed!"
fi

# Warn if sslmode is present in URL
if [[ "$DATABASE_URL" == *"sslmode"* ]]; then
  echo "WARNING: DATABASE_URL contains sslmode parameter which may cause issues with asyncpg!"
  env | grep -E "DATABASE|POSTGRES|SSL"
fi

# Ensure SSL is disabled by default
export PGSSLMODE=disable
export DB_SSL_MODE=disable

# Start app
exec "$@"
EOF

RUN chmod +x /app/entrypoint.sh /app/patch_ssl.py \
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
    DB_SSL_MODE=disable \
    PGSSLMODE=disable

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "server.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
