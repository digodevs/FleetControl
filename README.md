# FleetControl

![Version](https://img.shields.io/badge/version-1.0.0-0ea5e9)
![Java](https://img.shields.io/badge/Java-25-red)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed)
![License](https://img.shields.io/badge/license-MIT-white)

FleetControl is a professional fleet management system built as a full-stack portfolio project. Version `v1.0.0` delivers a secure Spring Boot API, PostgreSQL database with Flyway migrations, JWT authentication, vehicle management, executive dashboard, and a responsive React administrative interface.

## Objective

Provide a clean, production-oriented foundation for fleet operations with real database persistence, API documentation, automated validation, Docker execution, and a polished frontend suitable for portfolio presentation.

## Screenshots

Screenshots should be added after publishing the repository assets.

| Dashboard | Vehicles |
| --- | --- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/vehicles.png` |

## Architecture

FleetControl is organized as a monorepo:

```text
.
├── backend/                 # Spring Boot REST API
├── frontend/                # React + TypeScript SPA
├── docs/                    # Documentation and screenshots
├── docker-compose.yml       # PostgreSQL + backend + frontend
├── .env.example             # Environment variable reference
└── README.md
```

Backend layers:

```text
config        OpenAPI, security, application configuration
controller    REST endpoints
dto           Request and response contracts
entity        JPA entities and enums
exception     Domain and API exception handling
mapper        Entity/DTO mapping
repository    Spring Data repositories and optimized queries
security      JWT filter, token service, user details
service       Business use cases
```

Frontend layers:

```text
components    Reusable UI and feature components
contexts      Authentication and toast state
hooks         TanStack Query and UI hooks
layouts       Administrative shell
pages         Dashboard and vehicle screens
services      Axios API clients
types         Shared TypeScript contracts
```

## Technologies

Backend:

- Java 25
- Spring Boot 3.5
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate Validator
- PostgreSQL
- Flyway
- JWT
- Springdoc OpenAPI
- Maven Wrapper
- JUnit 5, Mockito, Spring Boot Test

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- Recharts
- Lucide React

Infrastructure:

- Docker
- Docker Compose
- Nginx
- GitHub Actions

## Features

- JWT login, refresh token, logout, and authenticated user endpoint.
- Role-based access with `ADMIN` and `EMPLOYEE`.
- Vehicle CRUD with validation, pagination, filtering, sorting, and duplicate checks.
- Executive dashboard with real PostgreSQL data.
- Swagger/OpenAPI with bearer JWT support.
- Dark administrative UI with sidebar, header, breadcrumb, dashboard charts, vehicle table, modals, pagination, skeletons, empty states, and toast notifications.
- Dockerized PostgreSQL, backend, and frontend stack.

## Environment Variables

Copy the example file and adjust local values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `POSTGRES_DB` | PostgreSQL database name |
| `POSTGRES_USER` | PostgreSQL user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `POSTGRES_PORT` | Host port for PostgreSQL |
| `BACKEND_PORT` | Host/backend application port |
| `SPRING_PROFILES_ACTIVE` | Spring profile, usually `dev` |
| `SPRING_DATASOURCE_URL` | JDBC URL for local backend execution |
| `SPRING_DATASOURCE_USERNAME` | Backend database user |
| `SPRING_DATASOURCE_PASSWORD` | Backend database password |
| `APP_CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `JWT_SECRET` | Strong JWT secret with at least 32 bytes |
| `JWT_ACCESS_EXPIRATION` | Access token duration in milliseconds |
| `JWT_REFRESH_EXPIRATION` | Refresh token duration in milliseconds |
| `FRONTEND_PORT` | Host port for the frontend container |
| `VITE_API_BASE_URL` | Public API base URL used by the frontend build |

Never commit real secrets, production passwords, or private `.env` files.

## Local Execution

Requirements:

- Java 25
- Node.js LTS
- Docker Desktop or compatible Docker engine

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

## Docker Execution

Build and start the full stack:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up --build -d
```

Stop the stack:

```bash
docker compose down
```

Remove the persistent PostgreSQL volume only when you intentionally want to reset local data:

```bash
docker compose down -v
```

Docker services:

- `postgres`: PostgreSQL 17 with persistent volume and healthcheck.
- `backend`: Spring Boot API built with Maven and Java 25.
- `frontend`: Vite build served by Nginx with SPA fallback.

## Database

Flyway owns schema creation and versioning. Hibernate is configured with `ddl-auto=validate`, so the application validates the schema instead of generating it.

Current migrations:

- `V1__create_database_foundation.sql`
- `V2__create_authentication_tables.sql`
- `V3__create_vehicle_table.sql`

## Authentication

Authentication uses JWT access tokens and refresh tokens.

Core endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Current authenticated user |

Protected endpoints require:

```text
Authorization: Bearer <access-token>
```

## API Modules

| Module | Endpoint | Access |
| --- | --- | --- |
| Dashboard | `GET /api/dashboard` | `ADMIN`, `EMPLOYEE` |
| Vehicles | `/api/vehicles` | read: `ADMIN`, `EMPLOYEE`; write: `ADMIN` |
| Auth | `/api/auth/*` | public and authenticated flows |

## Swagger / OpenAPI

Swagger UI is available after the backend starts:

```text
http://localhost:8080/api/swagger-ui.html
```

Use the `Authorize` button and paste a JWT access token to test protected endpoints.

## Quality Checks

Backend:

```bash
cd backend
./mvnw clean test
./mvnw clean package
```

Windows:

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

Docker:

```bash
docker compose up --build
```

## CI/CD

GitHub Actions runs on `push` and `pull_request` to `main`.

The workflow validates:

- Backend tests with Java 25 and Maven Wrapper.
- Backend package compilation.
- Frontend dependency installation.
- Frontend production build with Node LTS.

## Roadmap

Planned future modules:

- Drivers
- Maintenance
- Fueling
- Expenses
- Fines
- Documents
- Advanced reports
- Deployment profiles
- End-to-end tests

## License

This project is licensed under the MIT License. See `LICENSE`.

## Author

FleetControl was built as a professional full-stack portfolio project.
