# TaskFlow — Full-Stack Task Management System

**A full-stack web application for creating, organizing, and managing tasks.**

TaskFlow is a web-based task management project built with a modern frontend, a Python backend API, and a relational database. It provides an authenticated interface where users can access a dashboard and create and save tasks.

The project is intended to follow maintainable software engineering practices, with a clear separation between the frontend, backend, data layer, configuration, and testing.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Current Project Status](#current-project-status)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database and Migrations](#database-and-migrations)
- [Testing and Verification](#testing-and-verification)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

TaskFlow is designed to provide a straightforward workflow for managing tasks through a browser-based application.

The project separates the user interface from backend business logic and persistent storage.

### Main objectives

- Provide a usable task management interface.
- Support user registration and authentication.
- Allow users to create and save tasks.
- Connect the frontend to a backend API.
- Store application data in a database when the database integration is configured.
- Establish a maintainable foundation for testing, security, and future improvements.

### Target users

TaskFlow can be used by individuals who need a simple way to organize work, manage personal tasks, and track progress.

### Core workflow

1. A user opens the TaskFlow web application.
2. The user registers or signs in.
3. The authenticated user accesses the dashboard.
4. The user creates and saves a task.
5. The frontend communicates with the backend API.
6. The backend validates the request and processes the operation.
7. The application retrieves or stores data through its configured data layer.

The precise database behavior and authorization rules must be verified against the implementation.

---

## Current Project Status

The following capabilities have been manually confirmed during development:

| Capability | Status |
|---|---|
| Frontend starts successfully | Verified |
| User can sign in | Verified |
| Dashboard loads after sign-in | Verified |
| User can create and save tasks | Verified |
| Task editing and status updates | Needs verification |
| Task deletion | Needs verification |
| Persistence after browser refresh | Needs verification |
| Search, filtering, and sorting | Needs verification |
| Automated test coverage | Needs verification |
| Production deployment readiness | Not yet established |

**Important:** A working login page and dashboard do not, by themselves, establish that every backend feature, authorization control, or production requirement is complete.

---

## Features

### Authentication

The application includes a user sign-in flow. User registration has also been exercised during development.

Authentication should be verified for:

- Successful registration.
- Successful sign-in with valid credentials.
- Rejection of invalid credentials.
- Appropriate handling of expired or invalid authentication tokens.
- Protection of authenticated routes.

### Dashboard

The dashboard provides the main interface after sign-in.

Its exact statistics, widgets, and navigation depend on the current frontend implementation.

### Task Management

Task creation and saving have been confirmed.

The following are useful task management capabilities to verify or implement:

- Create a task with a title and description.
- View saved tasks.
- Edit task details.
- Change task status.
- Delete a task.
- Retain changes after refreshing the browser.

### Backend API

The backend uses FastAPI to expose HTTP endpoints to the frontend.

FastAPI provides OpenAPI-based API documentation, subject to the application's configuration.

### Database

The project configuration identifies PostgreSQL as the intended relational database.

Database availability, schema migrations, transaction handling, and persistence should be checked independently before production use.

---

## Technology Stack

The project uses or is configured around the following technologies. Confirm exact package versions in the relevant configuration files.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js | Web application and routing |
| UI library | React | User interface components |
| Backend | FastAPI | HTTP API and backend logic |
| Language | Python | Backend implementation |
| Database | PostgreSQL | Relational data storage |
| Python package manager | uv | Python dependencies and environment |
| API specification | OpenAPI | API schema and documentation |
| API testing interface | Swagger UI | Interactive endpoint testing |
| Containerization | Docker | Container execution |
| Service orchestration | Docker Compose, if configured | Local multi-service development |
| Version control | Git | Source history and collaboration |

---

## System Architecture

TaskFlow uses a frontend–backend architecture.

```text
                 ┌─────────────────────┐
                 │        User         │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Next.js Frontend  │
                 │   React Interface   │
                 └──────────┬──────────┘
                            │
                       HTTP / JSON
                            │
                            ▼
                 ┌─────────────────────┐
                 │    FastAPI Backend  │
                 │                     │
                 │ Authentication      │
                 │ Request Validation  │
                 │ Task Operations     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ PostgreSQL Database │
                 │                     │
                 │ Users and Tasks     │
                 │ if configured       │
                 └─────────────────────┘
```

### Frontend responsibilities

- Render pages and UI components.
- Collect user input.
- Send HTTP requests to the backend.
- Display API responses and validation errors.
- Maintain appropriate loading, success, and error states.

### Backend responsibilities

- Expose API endpoints.
- Validate request data.
- Authenticate users.
- Enforce authorization.
- Execute task-related business logic.
- Read and write data through the database layer.
- Return appropriate HTTP responses.

### Database responsibilities

- Store persistent application records.
- Maintain relationships and data integrity.
- Enforce applicable constraints.
- Support transactions and database queries.

The backend must enforce security and authorization independently of frontend behavior.

---

## Project Structure

The following is a reference structure. Keep the actual directory names in your repository if they differ.

```text
taskflow-fullstack/
│
├── README.md
├── .gitignore
├── .env.example
│
├── taskflow-api/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── db/
│   ├── migrations/
│   ├── tests/
│   ├── pyproject.toml
│   └── alembic.ini
│
├── taskflow-web/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── .env.local.example
│
├── docs/
│   ├── getting-started.md
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── testing.md
│   ├── security.md
│   └── deployment.md
│
└── infra/
    └── docker/
        └── compose.yaml
```

Some directories may not exist yet. Do not create empty folders simply to match this diagram; add them when they are needed by the implementation.

---

## Prerequisites

Install the following tools before setting up the project:

- **Git** — source control.
- **Node.js and npm** — frontend development.
- **Python** — backend development.
- **uv** — Python dependency and environment management.
- **Docker Desktop** — required if PostgreSQL is run through Docker.

Verify the tools in PowerShell:

```powershell
git --version
node --version
npm --version
python --version
uv --version
docker --version
docker compose version
```

If a command is not recognized, install or configure the relevant tool before continuing.

---

## Installation and Setup

### 1. Open the project directory

Open PowerShell in the directory containing the TaskFlow project.

For example, if the project is stored on your Desktop:

```powershell
Set-Location "$HOME\OneDrive\Desktop\taskflow-fullstack"
```

Adjust the path if your project is stored elsewhere.

Inspect the files:

```powershell
Get-ChildItem -Force
```

Locate the actual frontend, backend, and Docker Compose configuration files before running the following commands.

### 2. Configure the database

If the project contains a Docker Compose file, change to the directory containing that file.

List the available services:

```powershell
docker compose config --services
```

Start the database using its actual service name. If the service is named `db`, for example:

```powershell
docker compose up -d db
```

Check service status:

```powershell
docker compose ps
```

If Docker Compose reports that no configuration file was found, the command is being run from the wrong directory or the project does not contain a Compose file at that location.

Do not assume the database is running just because Docker Desktop is open.

### 3. Configure the backend

Change to the actual backend directory. For example:

```powershell
Set-Location .\taskflow-api
```

Install dependencies:

```powershell
uv sync
```

If the project defines a development dependency group and you need it, use:

```powershell
uv sync --dev
```

Configure the backend environment variables using the project's `.env.example`, if provided.

Do not commit real credentials or copy production secrets into documentation.

### 4. Configure the frontend

Open a separate PowerShell terminal and navigate to the actual frontend directory:

```powershell
Set-Location "$HOME\OneDrive\Desktop\taskflow-fullstack\taskflow-web"
```

Install the Node.js dependencies:

```powershell
npm install
```

Configure the frontend API base URL using the environment variable name expected by the application. Check the existing source code and environment examples rather than guessing the variable name.

---

## Environment Configuration

The backend may use environment variables for application settings, database connectivity, authentication, and cross-origin requests.

Example development configuration:

```dotenv
APP_NAME=TaskFlow API
ENVIRONMENT=development
DEBUG=false

DATABASE_URL=postgresql+psycopg://taskflow:taskflow_dev_only@localhost:5432/taskflow

JWT_SECRET_KEY=REPLACE_WITH_A_RANDOM_SECRET
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

PASSWORD_MIN_LENGTH=12
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

This is an illustrative configuration. Use only settings supported by the application's configuration code.

### Configuration guidance

- Replace the example JWT secret with a cryptographically random secret.
- Use credentials appropriate for your local database.
- Ensure the database URL matches the actual database name, user, password, host, and port.
- Allow only the frontend origins required for the environment.
- Never commit `.env` files containing real secrets.
- Keep `.env.example` free of working credentials.
- Use separate configuration and credentials for development, testing, and production.

### Generate a development secret

PowerShell can generate a random secret with Python:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

Place the generated value in your local environment configuration. Do not publish the secret in GitHub or include it in screenshots.

---

## Running the Application

Run the frontend and backend in separate terminals.

### Terminal 1 — Backend API

From the backend directory:

```powershell
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

When startup succeeds, the terminal should show that Uvicorn is running and the application has completed startup.

For a local development session, leave this terminal open.

### Terminal 2 — Frontend

From the frontend directory:

```powershell
npm run dev
```

Wait until the Next.js development server reports its local URL.

### Open TaskFlow

| Service | Local URL |
|---|---|
| Frontend application | http://localhost:3000 |
| FastAPI Swagger UI | http://127.0.0.1:8000/docs |
| FastAPI OpenAPI schema | http://127.0.0.1:8000/openapi.json |

These addresses assume the application is configured to use the default ports.

---

## API Documentation

FastAPI can expose an interactive API reference at:

**http://127.0.0.1:8000/docs**

Use the documentation to inspect the endpoints actually registered by the running application.

For each endpoint, document:

- HTTP method and path.
- Authentication requirements.
- Request parameters and body schema.
- Successful response schema.
- Validation errors and other failure responses.
- Authorization requirements.
- Expected side effects.

### Expected API areas

The application may expose endpoints for:

- Authentication and registration.
- User information.
- Task creation and retrieval.
- Task updates and deletion.

The exact endpoint paths, request fields, and supported operations must be confirmed from the running OpenAPI schema. This README does not assume that every listed endpoint is implemented.

---

## Database and Migrations

PostgreSQL is the intended relational database for this project.

If SQLAlchemy and Alembic are configured, SQLAlchemy can provide the data access layer and Alembic can manage database schema changes.

### Migration workflow

Review the migration configuration and existing migration files before applying migrations.

For a project configured with Alembic:

```powershell
uv run alembic current
```

Apply reviewed migrations to the intended development database:

```powershell
uv run alembic upgrade head
```

Generate a migration only after confirming that the SQLAlchemy models and Alembic metadata are configured correctly.

Database migration commands must be executed from the directory containing the relevant Alembic configuration, or with an explicitly configured path.

### Data integrity

The implementation should be checked for:

- Primary and foreign keys.
- Appropriate uniqueness constraints.
- Required-field constraints.
- Transaction handling.
- Safe database connection management.
- User ownership of task records.
- Indexes for frequently queried fields where justified.

### Backup and recovery

For any environment containing valuable data, document backup frequency, retention, access control, restore procedures, and recovery test results.

A successful backup command does not prove that the backup can be restored.

---

## Testing and Verification

Testing should cover both individual components and the complete user workflow.

### Manual functional tests

| Test | Expected result |
|---|---|
| Open the frontend | The application loads |
| Register a user | Valid registration succeeds |
| Sign in with valid credentials | The user can access the dashboard |
| Sign in with invalid credentials | Access is rejected |
| Create a task | The task is saved and displayed |
| View task details | Correct details are displayed |
| Edit a task | Changes are saved, if editing is supported |
| Change task status | Status updates, if supported |
| Delete a task | The task is removed, if deletion is supported |
| Refresh the browser | Saved data remains available |
| Access a protected page while signed out | Access is restricted |
| Attempt cross-user task access | Unauthorized access is rejected |

Record each result as **Passed**, **Failed**, or **Not Implemented**.

### Backend tests

If pytest is configured, run the test suite from the backend directory:

```powershell
uv run pytest
```

The project should include unit tests for business logic and API tests for successful requests, validation failures, authentication, and authorization.

### Frontend checks

Use the scripts defined in `package.json`.

Common examples include:

```powershell
npm run lint
npm run build
```

These commands are available only if the corresponding scripts are configured.

### Integration testing

Test the complete workflow across the frontend, API, and database.

Confirm that saved data is persisted by the backend rather than merely stored in temporary frontend state.

---

## Security Considerations

Security controls must be implemented and tested in the backend, not merely hidden or disabled in the frontend.

### Authentication

- Validate credentials on the server.
- Store passwords using an appropriate password-hashing algorithm.
- Validate token signatures, expiry, and required claims.
- Protect authenticated endpoints.
- Handle logout and token expiry according to the authentication design.

### Authorization

- Check the authenticated user's permissions on every protected operation.
- Restrict users to resources they are authorized to access.
- Enforce task ownership in backend queries.
- Avoid trusting client-supplied user IDs without authorization checks.
- Test attempts to read, update, or delete another user's tasks.

### Secrets and configuration

- Exclude local `.env` files from version control.
- Never expose JWT signing secrets or database passwords in frontend code.
- Use a secret manager or equivalent secure configuration in production.
- Rotate credentials if they are accidentally exposed.

### CORS

Configure CORS to allow only the origins required by the application.

CORS is a browser security mechanism. It is not a substitute for authentication, authorization, or API access controls.

### Production safeguards

Before production use, assess:

- HTTPS and secure transport.
- Rate limiting for sensitive endpoints.
- Input validation and safe error responses.
- Dependency vulnerabilities.
- Logging and monitoring.
- Database privileges and network access.
- Backup and recovery procedures.
- Authentication and authorization test coverage.

---

## Troubleshooting

### Docker Compose: configuration file not found

**Symptom:**

```text
no configuration file provided: not found
```

**Cause:** Docker Compose cannot find its configuration file in the current directory.

**Resolution:**

```powershell
Get-Location
Get-ChildItem -Force
```

Locate the actual Compose file, enter its directory, and retry the command.

### Backend: Alembic command not found

**Symptom:** The Alembic executable cannot be found.

**Resolution:**

1. Confirm you are in the backend project directory.
2. Check that Alembic is declared in the project's dependency configuration.
3. Install the configured dependencies using `uv sync`.
4. Verify that the Alembic configuration file exists.
5. Retry `uv run alembic current`.

### Frontend: registration or login keeps loading

**Possible causes:**

- The backend is stopping or restarting.
- The API URL is incorrect.
- The database is unavailable.
- The registration request fails.
- The frontend does not handle an error response correctly.

**Resolution:**

1. Keep the backend terminal running.
2. Open the browser developer tools with `F12`.
3. Inspect the **Network** tab.
4. Check whether the registration or login request reaches the backend.
5. Inspect the request's HTTP status and response.
6. Check backend logs for exceptions.

A successful `OPTIONS` response indicates that a browser preflight request succeeded; it does not prove that the actual registration or login request succeeded.

### CORS errors

Verify that the configured frontend origin matches the browser URL, including protocol and port.

For example, `http://localhost:3000` and `http://127.0.0.1:3000` are distinct origins.

### Database connection errors

Check:

- The database service is running.
- The host and port are correct.
- Database credentials match the local environment.
- The configured database exists.
- Required migrations have been applied.
- The backend can reach the database.

### Frontend cannot connect to the backend

Confirm that the API is accessible at the configured address and that the frontend uses the correct environment variable. Restart the frontend development server after changing environment configuration.

---

## Development Workflow

Use a controlled workflow for code changes.

1. Inspect the existing implementation before editing.
2. Create a Git branch for a meaningful change.
3. Implement one focused change at a time.
4. Add tests for the expected behavior.
5. Run relevant tests and checks.
6. Review the changes and confirm no secrets are included.
7. Update documentation when behavior or configuration changes.
8. Commit the change with a descriptive message.

Example Git commands:

```powershell
git status
git switch -c feature/task-improvements
git diff
```

Only commit after reviewing the changed files and running the relevant checks.

---

## Roadmap

The following items are potential improvements, not claims about current implementation.

### Phase 1 — Core application

- [x] Frontend loads successfully.
- [x] User sign-in works.
- [x] Dashboard loads after sign-in.
- [x] Task creation and saving work.
- [ ] Verify task details and persistence.
- [ ] Verify editing, status updates, and deletion.
- [ ] Verify error handling and validation.

### Phase 2 — Quality and reliability

- [ ] Add or complete automated backend tests.
- [ ] Add frontend and end-to-end tests.
- [ ] Verify database migrations.
- [ ] Improve loading and error states.
- [ ] Add structured application logging.
- [ ] Document backup and recovery procedures.

### Phase 3 — Security

- [ ] Verify password hashing and token handling.
- [ ] Test protected API endpoints.
- [ ] Enforce and test user-level task ownership.
- [ ] Review secrets and CORS configuration.
- [ ] Add rate limiting and other required safeguards.

### Phase 4 — Product improvements

- [ ] Task editing and status management, if not already implemented.
- [ ] Search, filtering, and sorting.
- [ ] Due dates and task priorities.
- [ ] Improved dashboard summaries.
- [ ] Responsive layout and accessibility improvements.

### Phase 5 — Deployment readiness

- [ ] Define development, testing, and production configurations.
- [ ] Establish CI checks.
- [ ] Configure production database and secrets.
- [ ] Add health checks and monitoring.
- [ ] Test migrations, backups, recovery, and rollback.
- [ ] Complete a security and operational readiness review.

---

## Contributing

Contributions should keep the codebase understandable, tested, and maintainable.

1. Create a branch for your change.
2. Follow the project's existing coding conventions.
3. Keep changes small and focused.
4. Add or update tests.
5. Run the relevant quality checks.
6. Update documentation when needed.
7. Review the final Git diff before committing.

---

## License

No license is specified in this README.

Before making the repository public or distributing the application, choose and add an appropriate license file, such as MIT, if that matches your intended terms.

---

## Project Summary

TaskFlow is a full-stack task management application built around a Next.js frontend, a FastAPI backend, and a PostgreSQL database configuration.

The current development milestone is a working sign-in flow, dashboard, and task creation. The next priority is to validate the complete task lifecycle, persistence, authorization, automated testing, and operational safeguards before describing the application as production-ready.