# Architecture

## Components
- Frontend: renders pages and collects user input.
- Backend: validates requests, authenticates users, applies business rules, and accesses data.
- Database: stores users and tasks when configured.

## Request Flow
1. A user interacts with the frontend.
2. The frontend sends an HTTP request to the API.
3. The API validates input and checks authentication and authorization.
4. The backend reads or writes database records.
5. The API returns a response and the frontend updates the interface.

## Trust Boundaries
The frontend is untrusted. All validation, permission checks, and task ownership enforcement must occur on the backend.

## Configuration
Document actual API URL settings, CORS origins, database access, and deployment topology after confirming the code.