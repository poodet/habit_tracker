## Quick instructions for AI coding agents

Be concise. This project is a two-service web app: a Next.js frontend in `/frontend` and a NestJS backend in `/backend` with PostgreSQL and Redis managed via `docker-compose.yml`.

- Big picture
  - Frontend: `/frontend` (Next.js 14, React 18). Client code lives in `app/` and reusable UI in `components/`. API calls use `lib/api.ts` and expect the backend under `/api` (env var `NEXT_PUBLIC_API_URL`).
  - Backend: `/backend` (NestJS). Modules are under `src/` with subfolders `auth`, `users`, `object-definitions`, `calendar-events`. DTOs live in `dto/`, entities in `entities/`, and `app.module.ts` wires modules.
  - Infrastructure: `docker-compose.yml` defines services: `postgres`, `redis`, `backend`, `frontend`. Backend default port = 3001 (mapped via `BACKEND_PORT`), frontend = 3000. Postgres container maps DB port 5432 -> host 5433 in compose.

- Important conventions and patterns
  - Backend uses TypeORM entities (see `backend/src/**/entities/*.ts`) and DTOs with `class-validator` for request validation.
  - Frontend uses Zod for runtime schema validation and React Hook Form for form handling (`frontend/components/*`, `frontend/app/*`).
  - Custom object schemas are stored in Postgres JSONB fields (`object-definition.entity.ts` and calendar event `data` JSONB). Keep JSON schema handling consistent between `backend` (AJV/validation) and `frontend` (Zod conversion).
  - Auth is JWT-based. Look at `backend/src/auth/*` for how tokens are issued and validated; frontend includes auth flows that call `/api/auth/login` and attach `Authorization: Bearer <token>`.

- Developer workflows (commands you can run)
  - Start everything (recommended): `docker-compose up -d --build` (requires a `.env` with POSTGRES_*, BACKEND_PORT, JWT_SECRET, etc.).
  - Backend local dev: `cd backend && npm install && npm run start:dev` (hot reload enabled).
  - Frontend local dev: `cd frontend && npm install && npm run dev`.
  - Tests: backend `cd backend && npm run test` / `npm run test:e2e`; frontend `cd frontend && npm run test`.
  - Lint/format: `cd backend && npm run lint` / `npm run format`; `cd frontend && npm run lint`.

- Environment notes
  - All runtime config comes from `.env`. `docker-compose.yml` expects variables like `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `BACKEND_PORT`, `JWT_SECRET`, `JWT_EXPIRATION`. Ensure `.env` is present at project root.
  - In `docker-compose.yml` the frontend reads `NEXT_PUBLIC_API_URL` and must point at the backend API (example: `http://localhost:3001/api`). Prefer setting `BACKEND_PORT` in `.env` and referencing `${BACKEND_PORT}` in compose.

- Integration and cross-component touchpoints
  - API surface is namespaced under `/api` on the backend. Key endpoints: `/api/auth/*`, `/api/object-definitions/*`, `/api/calendar-events/*`.
  - DB schema: `users`, `object_definitions` (schema JSONB), `calendar_events` (data JSONB). When altering entity fields, update TypeORM entities, DTOs, and frontend types in `frontend/types/index.ts`.
  - Docker volumes are used for hot reload (`./backend:/app`, `./frontend:/app`). When changing Dockerfile or build scripts, prefer local dev commands first.

- Files to inspect for context when making changes
  - Backend: `backend/src/app.module.ts`, `backend/src/main.ts`, `backend/src/auth/*`, `backend/src/object-definitions/*`, `backend/src/calendar-events/*`.
  - Frontend: `frontend/lib/api.ts`, `frontend/app/*`, `frontend/components/*`, `frontend/types/index.ts`.
  - Infra: `docker-compose.yml`, `.env.example`, `Dockerfile` in root-level service folders.

- Quick examples for common edits
  - Adding a new API route: create controller and service under `backend/src/<module>`, add DTO in `dto/`, update module registration in `app.module.ts`, then update `frontend/lib/api.ts` and `frontend/types`.
  - Changing a DB column: update TypeORM entity, run migration if using migrations (this project uses TypeORM entities directly), update DTOs and frontend types.

- Safety and verification
  - After changes run backend unit tests and the frontend build: `cd backend && npm run test && cd ../frontend && npm run build`.
  - Use `docker-compose logs -f backend` and `docker-compose logs -f frontend` to inspect runtime issues when using Docker.

- Goal of the project
  - A habit tracking app where users define custom habit types (object definitions) with dynamic schemas, and log events against those habits on a calendar interface.
  - Learn web technologies (especially React and Node.js related) and best practices in a full-stack TypeScript environment. Create a clean, scalable codebase with good separation of concerns. Be particularly attentive to anti-patterns, performance, and security best practices.

If anything above is unclear or you want more detail (CI steps, specific entity-to-UI mappings, or example `.env`), tell me which area to expand. Iterate with small, focused updates.
