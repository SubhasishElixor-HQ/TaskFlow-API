# TaskFlow — Full-Stack Task Management Application

TaskFlow is a full-stack task management application designed to help users organize, track, and manage their tasks through a web interface.

The project uses a frontend, backend API, and database to support the application's core workflow.

## Features

### Currently verified
- User registration and sign-in.
- Dashboard access after authentication.
- Task creation and saving.

### Additional features to verify
- View task details.
- Edit existing tasks.
- Update task status.
- Delete tasks.
- Search, filtering, and sorting.
- Data persistence after refreshing the browser.
- User-specific task access.

> Only features confirmed by implementation and testing should be described as completed.

## Technology Stack

The project is intended to use the following technologies. Confirm the installed versions in the project configuration files.

| Layer | Technology |
|---|---|
| Frontend | Next.js and React |
| Backend | Python and FastAPI |
| Database | PostgreSQL |
| API documentation | OpenAPI / Swagger UI |
| Python dependencies | uv |
| Containers | Docker and Docker Compose, if configured |

## Architecture

```text
User
  |
  v
Next.js Frontend
  |
  | HTTP requests
  v
FastAPI Backend
  |
  | Database operations
  v
PostgreSQL Database
```

The frontend handles the user interface. The backend validates requests, enforces authentication and authorization, and processes task operations. PostgreSQL stores application data when database integration is configured.

## Prerequisites

Install the tools required by your project:

- Git
- Node.js and npm
- Python
- uv
- Docker Desktop, if using containerized PostgreSQL

## Getting Started

### 1. Start the database

Open PowerShell in the directory containing your actual Docker Compose file.

Check the available services:

```powershell
docker compose config --services
```

Start the database service using its actual service name, for example:

```powershell
docker compose up -d db
```

If the Compose file does not exist in the current directory, locate it before running these commands.

### 2. Configure the backend

Navigate to the backend directory:

```powershell
cd taskflow-api
```

Install dependencies:

```powershell
uv sync
```

Configure your local environment variables in `.env`, following the project's `.env.example` if available.

Never commit real passwords, database credentials, or JWT secrets.

Start the API:

```powershell
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Keep the terminal open.

### 3. Start the frontend

Open a second PowerShell terminal and navigate to the frontend directory:

```powershell
cd taskflow-web
```

Install dependencies:

```powershell
npm install
```

Configure the frontend API URL according to the environment-variable name expected by the application.

Start the frontend:

```powershell
npm run dev
```

Keep this terminal open.

### 4. Open the application

- Frontend: http://localhost:3000
- API documentation: http://127.0.0.1:8000/docs
- API OpenAPI schema: http://127.0.0.1:8000/openapi.json

These URLs assume the application is configured to use the default local ports.

## Testing

Test the following workflows before considering the application ready for release:

1. Register a new user.
2. Sign in with valid credentials.
3. Confirm invalid credentials are rejected.
4. Create and view a task.
5. Edit a task, if supported.
6. Update its status, if supported.
7. Delete a task, if supported.
8. Refresh the browser and check persistence.
9. Confirm one user cannot access another user's tasks.
10. Check API responses and backend logs for errors.

Use the test commands documented by the actual frontend and backend project configuration.

## Security

- Store secrets in environment variables or a managed secret store.
- Keep `.env` out of version control.
- Use strong, randomly generated JWT signing secrets.
- Validate and authorize every protected API request.
- Enforce task ownership in backend database queries.
- Configure CORS for explicitly allowed frontend origins.
- Use HTTPS in production.
- Avoid logging passwords, access tokens, and other sensitive values.
- Use database migrations for controlled schema changes.

## Documentation

See the `docs/` directory for detailed project documentation.

| Document | Purpose |
|---|---|
| `docs/getting-started.md` | Local setup and troubleshooting |
| `docs/architecture.md` | Frontend, backend, and database design |
| `docs/api.md` | API endpoints and request conventions |
| `docs/database.md` | Database schema and migrations |
| `docs/testing.md` | Testing strategy and procedures |
| `docs/security.md` | Authentication, authorization, and secrets |
| `docs/deployment.md` | Production deployment considerations |

## Current Project Status

The frontend login flow, dashboard access, and task creation have been manually verified by the developer. Other capabilities, automated tests, security controls, deployment readiness, and backup/recovery procedures must be independently verified before being claimed as production-ready.

## Contributing

1. Create a branch for your change.
2. Keep changes focused and reviewable.
3. Add or update tests.
4. Run relevant checks before committing.
5. Update documentation when behavior or configuration changes.

## License

Add the appropriate license before distributing or publishing this project.