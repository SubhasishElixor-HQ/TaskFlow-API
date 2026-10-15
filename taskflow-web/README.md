# TaskFlow Web

A responsive Next.js App Router frontend for the TaskFlow FastAPI API. Includes an overview dashboard, task search/filtering, task creation, status updates, deletion, and login/registration screens.

## Requirements
- Node.js 20.9 or newer
- The TaskFlow FastAPI backend and PostgreSQL database running locally

## Run locally (Windows PowerShell)

```powershell
# From this taskflow-web folder
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Connect to FastAPI

`.env.local` should contain:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
```

The backend must allow the frontend origin in its `.env` file. Set `CORS_ORIGINS` to a JSON array, for example:

```env
CORS_ORIGINS=["http://localhost:3000"]
```

Restart the backend after changing its environment. If you also access the frontend using `http://127.0.0.1:3000`, add that origin too.

## Useful commands

```powershell
npm run dev
npm run typecheck
npm run lint
npm run build
npm start
```

## API assumptions

The frontend expects these routes from the included TaskFlow API:
- `POST /auth/register` with `{ "email", "password" }`
- `POST /auth/login` with `{ "email", "password" }`, returning `{ "access_token", "token_type" }`
- `GET /tasks?limit=100` (Bearer token)
- `POST /tasks` with `{ "title", "description" }`
- `PATCH /tasks/{id}` with `{ "status" }`
- `DELETE /tasks/{id}`

## Security and production notes

This is a polished frontend foundation, not a security certification. The current API returns bearer JWTs, so this starter stores the token in `localStorage` to support the existing backend. For public production deployment, prefer a same-origin backend-for-frontend with `HttpOnly`, `Secure`, `SameSite` cookies; add CSRF protections as appropriate, CSP/security headers, rate limiting, error monitoring, accessibility testing, and end-to-end tests. Configure CORS narrowly and use HTTPS. Do not store secrets in `NEXT_PUBLIC_*` variables; they are exposed to the browser.
