# FastAPI Server Improvement Plan: Local & Cloud Readiness

## ✅ What's Already Excellent
- Clear separation of local vs. cloud config (Secrets, DB, CORS)
- Modular API structure with routers
- Use of Pydantic for validation
- SQLAlchemy ORM integration

## 1. Configuration & Secrets Management
- ✅ Use environment variables for all sensitive and environment-specific settings
  - ✅ Use `.env` for local development (never commit secrets)
  - ✅ In production (ECS), inject environment variables or use AWS Secrets Manager/SSM
- ✅ Remove YAML config completely - use pure Pydantic settings
- ✅ Ensure CORS origins, DB credentials, and other secrets are never hardcoded
- ✅ Avoid `load_dotenv()` in production code - only for local dev
- ✅ Add environment-specific config file support:
  ```python
  # Support .env.dev, .env.staging, .env.prod for local simulation
  class Settings(BaseSettings):
      ENVIRONMENT: str = "dev"
      
      class Config:
          env_file = f".env.{os.getenv('ENVIRONMENT', 'dev')}"
          case_sensitive = True
  ```
  - Run with: `ENVIRONMENT=staging python -m uvicorn server.backend.main:app`
  - Production ECS still uses injected env vars, not files

## 2. Dockerization & Build Optimization
- ✅ Use a non-root user in the Dockerfile for security
- ✅ Implement multi-stage Docker build to reduce image size:
  - ✅ Stage 1: Build dependencies
  - ✅ Stage 2: Copy only compiled app + production deps
- ✅ Use slim base images like `python:3.13-slim`
- ✅ Expose only the necessary port (8000)
- ✅ CMD should use Uvicorn with the correct app path
- ✅ Mount `.env` or inject secrets at runtime, not in the image

## 3. Database Handling & Async Support
- ✅ Upgrade to SQLAlchemy 2.0 + asyncpg
  - ✅ Use asyncpg as the driver for better async support and performance
  - ✅ Use sqlalchemy.ext.asyncio with AsyncSession
  - ✅ Ensure all queries are awaited properly
- ✅ Use SQLAlchemy connection pooling with proper sizing
- ✅ Ensure DB credentials are loaded from environment variables
- ✅ For local dev, use a local Postgres instance; for cloud, use RDS with secure networking
- ✅ Use SSL for RDS connections in production
- ✅ Add graceful connection cleanup on shutdown:
  ```python
  @app.on_event("shutdown")
  async def shutdown():
      await engine.dispose()  # Clean up async engine
  ```

## 4. Database Migrations: Safe Automation
- ✅ Use Alembic with your SQLAlchemy models
- ✅ In CI/CD, run migrations as a pre-deploy step
- ✅ Avoid running migrations automatically in app startup (can lead to race conditions)
- ✅ Consider the impact on Alembic when using async drivers - you may need to run migrations with sync engines

## 5. API Security & Best Practices

### 5.1 JWT Authentication and RBAC (DEFERRED)
- 🔄 **DEFERRED**: Implement JWT-based authentication for all non-public endpoints
  - JWT configuration is kept in settings.py for future use
  - Will implement when user authentication becomes a requirement
  - For now, API serves public data without authentication

- ✅ Restrict CORS to only your Vercel domain in production
- ✅ Add input validation using Pydantic schemas (already present)
- ✅ Add security headers middleware
- ✅ Implement rate limiting (e.g., with slowapi) to prevent abuse
- ✅ Sanitize all inputs and handle exceptions gracefully
- ✅ Add `/health` and `/ready` endpoints for ECS/ALB health checks

## 6. Logging & Monitoring
- ✅ Replace `print` statements with structured JSON logging for CloudWatch
- ✅ Add a `/metrics` endpoint with Prometheus instrumentation
- 🔄 Consider integrating with AWS X-Ray or another APM for tracing
- ✅ Log request headers like X-Request-ID for traceability

## 7. OpenAPI Enhancements & Docs
- ✅ Customize `/docs` with auth support
- 🔄 Optionally generate client SDKs for frontend (e.g., with openapi-python-client)
- ✅ Improve API documentation with examples and descriptions

## 8. Automated Testing & CI/CD
- 🔄 Expand test coverage (unit, integration, API)
- ✅ Use pytest-asyncio to test async endpoints and DB access
- ✅ Mock external services (DB, secrets) or use testcontainers
- ✅ Add code coverage reports in CI
- ✅ Add a GitHub Actions workflow to run tests before building/pushing Docker images
- ✅ Fail the build if tests do not pass

## 9. Frontend (Vercel) Integration
- ✅ Set the API base URL in Vercel environment variables
- ✅ Ensure CORS in FastAPI only allows the Vercel domain in production
- ✅ Document the API endpoints and expected responses for frontend developers

## 10. Prioritized Remaining Tasks
1. 🔄 Expand test coverage for better reliability
2. 🔄 Consider X-Ray integration for better observability in production

## 11. Deferred for Future Implementation
1. 🔄 JWT authentication and RBAC - when user management becomes necessary
2. 🔄 Client SDK generation - if frontend needs tighter API integration

## Folder Structure Suggestion
```
server/
├── backend/
│   ├── routers/            ← Modular APIs (good)
│   ├── models/             ← ORM models
│   ├── schemas/            ← Pydantic validation schemas
│   ├── services/           ← Business logic (good separation)
│   ├── middleware.py       ← Security headers and rate limiting
│   ├── database.py         ← Move to async SQLAlchemy setup
│   ├── main.py             ← Entrypoint
│   └── config.py           ← Pure Pydantic settings
├── alembic/                ← Database migrations
│   └── versions/           ← Migration scripts
├── tests/                  ← Test suite
├── requirements.txt        ← Production dependencies
├── requirements-dev.txt    ← Development dependencies
├── Dockerfile
├── .env.dev                ← Dev environment (never commit)
├── .env.staging            ← Staging environment simulation
└── .env.prod               ← Production environment simulation (without secrets)
```

## Alternatives to Consider
- If you want to simplify deployment: Use AWS App Runner instead of ECS
- If you want to simplify CI/CD: Use AWS CodePipeline instead of GitHub Actions
- For auth as a service: Use Auth0 or Cognito instead of implementing JWT yourself 