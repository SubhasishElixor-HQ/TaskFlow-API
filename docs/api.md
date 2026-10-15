# API Reference

Interactive API documentation is available at `/docs` while the FastAPI server is running.

## Endpoint Inventory
Record the actual routes from the OpenAPI schema. Do not assume an endpoint exists because it is listed here as a desired feature.

For each endpoint document:
- HTTP method and path
- Authentication requirements
- Request body and validation rules
- Successful response schema
- Error status codes
- Authorization and ownership checks

## Common HTTP Status Codes
- 200: request succeeded
- 201: resource created, when used by the API
- 400: invalid request
- 401: authentication required or invalid
- 403: action forbidden
- 404: resource not found
- 422: request validation failed
- 500: unexpected server error

Confirm actual status codes against the running API.