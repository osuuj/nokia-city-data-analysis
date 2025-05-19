FROM python:3.12-slim-bookworm AS builder

WORKDIR /app
COPY requirements.txt .

# Add build date to bust cache
ARG BUILD_DATE=unknown
LABEL build_date=$BUILD_DATE

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

# Create SSL patch file
RUN echo '#!/usr/bin/env python3\n\
    import os\n\
    import re\n\
    \n\
    def patch_database_file():\n\
    """Patch the database.py file to modify SSL settings"""\n\
    file_path = "server/backend/database.py"\n\
    \n\
    # Read the file\n\
    with open(file_path, "r") as f:\n\
    content = f.read()\n\
    \n\
    # Replace the SSL configuration section\n\
    pattern = r"# Only enable SSL in production or if explicitly set\\nif settings\\.ENVIRONMENT == \\"production\\" or settings\\.DB_SSL_MODE == \\"require\\":\\n    # Enable SSL\\n    connect_args\\[\\"ssl\\"\\] = True\\n    logger\\.info\\(\\"SSL enabled for database connection\\"\\)"\n\
    \n\
    replacement = """# Check SSL mode setting\n\
    if settings.DB_SSL_MODE == "disable" or os.environ.get("PGSSLMODE") == "disable":\n\
    # Explicitly disable SSL\n\
    connect_args["ssl"] = False\n\
    logger.info("SSL disabled for database connection")\n\
    elif settings.ENVIRONMENT == "production" or settings.DB_SSL_MODE == "require":\n\
    # Enable SSL\n\
    connect_args["ssl"] = True\n\
    logger.info("SSL enabled for database connection")"""\n\
    \n\
    new_content = re.sub(pattern, replacement, content)\n\
    \n\
    # Write back to the file\n\
    with open(file_path, "w") as f:\n\
    f.write(new_content)\n\
    \n\
    print(f"Patched {file_path} to fix SSL configuration")\n\
    \n\
    if __name__ == "__main__":\n\
    patch_database_file()' > /app/patch_ssl.py \
    && chmod +x /app/patch_ssl.py

# Create script to parse DATABASE_CREDENTIALS and test connection
RUN echo '#!/bin/bash\n\
    # Apply SSL patch first\n\
    python /app/patch_ssl.py\n\
    \n\
    # Script to handle database credentials from AWS Secrets Manager\n\
    if [ -n "$DATABASE_CREDENTIALS" ]; then\n\
    echo "Processing database credentials from secret..."\n\
    # Extract values from JSON\n\
    export POSTGRES_USER=$(echo $DATABASE_CREDENTIALS | jq -r .username)\n\
    export POSTGRES_PASSWORD=$(echo $DATABASE_CREDENTIALS | jq -r .password)\n\
    export POSTGRES_HOST=$(echo $DATABASE_CREDENTIALS | jq -r .host)\n\
    export POSTGRES_PORT=$(echo $DATABASE_CREDENTIALS | jq -r .port)\n\
    echo "Database connection configured from secret"\n\
    echo "Testing direct database connection with psql..."\n\
    PGPASSWORD=$POSTGRES_PASSWORD PGSSLMODE=disable psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $DATABASE_NAME -c "SELECT 1 as connection_test;" || echo "Direct psql connection failed!"\n\
    fi\n\
    \n\
    # Check for any DATABASE_URL with sslmode\n\
    if [[ "$DATABASE_URL" == *"sslmode"* ]]; then\n\
    echo "WARNING: DATABASE_URL contains sslmode parameter which may cause issues with asyncpg!"\n\
    env | grep -E "DATABASE|POSTGRES|SSL"\n\
    fi\n\
    \n\
    # Ensure SSL is disabled by default\n\
    export PGSSLMODE=disable\n\
    export DB_SSL_MODE=disable\n\
    \n\
    # Start the application\n\
    exec "$@"\n' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

RUN chown -R appuser:appuser /app && chmod -R 755 /app
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