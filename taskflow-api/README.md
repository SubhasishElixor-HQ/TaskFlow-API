# TaskFlow API

A learning project demonstrating a maintainable FastAPI backend with PostgreSQL, SQLAlchemy 2, Alembic, JWT bearer authentication, password hashing, pytest, Docker Compose, and GitHub Actions.

> This is a production-oriented learning baseline, not a security-audited production service. Before real deployment, configure a strong secret, production database credentials, HTTPS, rate limiting, monitoring, backups/restore tests, dependency scanning, and operational policies.

## Requirements

- Python 3.12+
- PostgreSQL 16+ (or Docker Desktop with Compose)
- `uv` (recommended) or pip

## Local setup with uv

```powershell
Copy-Item .env.example .env
uv sync --dev
```

Edit `.env`. Set `DATABASE_URL` to your local PostgreSQL connection string. Replace the development JWT secret with a unique random value. Never commit `.env`.

Start PostgreSQL with Docker Compose (database only):

```powershell
docker compose up -d db
```

Apply migrations:

```powershell
uv run alembic upgrade head
```

Start the API:

```powershell
uv run uvicorn app.main:app --reload
```

Visit `http://127.0.0.1:8000/health`, `http://127.0.0.1:8000/docs`, or `http://127.0.0.1:8000/openapi.json`.

## Database migrations

Generate a migration after changing models:

```powershell
uv run alembic revision --autogenerate -m "describe schema change"
```

Inspect the generated migration before applying it. Then run `uv run alembic upgrade head`. Do not use `Base.metadata.create_all()` to manage application schema outside isolated tests.

## Tests and lint

Tests use an isolated in-memory SQLite database for API behavior. PostgreSQL migrations and PostgreSQL-specific behavior should additionally be validated against PostgreSQL in development and CI.

```powershell
uv run pytest
uv run ruff check .
uv run ruff format --check .
```

## Docker Compose

For a local all-in-one container run, set `POSTGRES_PASSWORD` and `JWT_SECRET_KEY` in your shell or a local ignored `.env`, then:

```powershell
docker compose up --build -d
```

Apply migrations from a local environment configured to reach the Compose database, or add a dedicated one-shot migration job before treating the Compose deployment as complete. The API container does not automatically run migrations.

The Compose defaults are for local development only. Do not expose the database publicly or reuse development credentials in production.

## API endpoints

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks?status=pending&limit=20&offset=0`
- `GET /api/v1/tasks/{task_id}`
- `PATCH /api/v1/tasks/{task_id}`
- `DELETE /api/v1/tasks/{task_id}`

Register and login return/use bearer tokens. Send `Authorization: Bearer <token>` to task endpoints. A user's task queries are scoped to that authenticated user.

## Important limitations before production

- Add rate limiting and abuse protection to registration and login.
- Review token revocation/refresh strategy and secret rotation.
- Define password reset, email verification, account lifecycle, and lockout policies as needed.
- Configure production secrets through a secret manager.
- Use HTTPS, restrictive CORS, and appropriate trusted-proxy settings.
- Add migrations validation against PostgreSQL and deployment-safe migration orchestration.
- Configure structured JSON logging, metrics, tracing, alerts, and redaction.
- Establish backup schedules and test restore procedures.
- Add security scanning, pinned action versions, and branch protection.
- Review privacy, retention, and compliance requirements before handling real user data.
