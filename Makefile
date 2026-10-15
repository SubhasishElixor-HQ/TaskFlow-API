.PHONY: help db-up db-down db-logs api web test

help:
	@echo "TaskFlow development commands"
	@echo "db-up    Start PostgreSQL"
	@echo "db-down  Stop PostgreSQL"
	@echo "db-logs  View PostgreSQL logs"
	@echo "api      Run the FastAPI backend"
	@echo "web      Run the Next.js frontend"
	@echo "test     Run backend tests"

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

db-logs:
	docker compose logs -f postgres

api:
	cd taskflow-api && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000

web:
	cd taskflow-web && npm run dev

test:
	cd taskflow-api && uv run pytest