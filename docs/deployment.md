# Deployment Guide

## Before Deployment
- Run automated tests and dependency checks.
- Review environment variables and secret handling.
- Apply reviewed database migrations.
- Configure HTTPS, CORS, logging, health checks, and backups.
- Confirm database permissions and network access.

## Deployment
Document the actual hosting provider, build commands, runtime commands, environment configuration, database provisioning, and migration procedure.

## Operations
Monitor application errors, latency, availability, database capacity, and failed background work if applicable.

## Rollback and Recovery
Document how to roll back application releases, handle incompatible database changes, restore backups, and verify service recovery.

Do not mark production deployment complete until these procedures have been tested.