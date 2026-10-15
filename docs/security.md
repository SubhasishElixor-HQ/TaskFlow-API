# Database Guide

## Configuration
Document the database engine, database name, connection configuration, and required environment variables. Never include real credentials.

## Schema
Document the actual user and task tables, primary keys, foreign keys, timestamps, indexes, and ownership relationships.

## Migrations
If Alembic is configured, review migration files before applying them. Use `uv run alembic upgrade head` to apply migrations in the intended environment.

## Data Integrity
Use database constraints and transactions where appropriate. Enforce task ownership in backend queries.

## Backups and Recovery
Document backup frequency, retention, restore instructions, and the results of restore tests. A successful backup command alone does not prove recovery works.