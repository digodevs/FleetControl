# Contributing

Thank you for your interest in FleetControl.

## Development Workflow

1. Fork the repository.
2. Create a branch from `main`.
3. Keep changes focused and aligned with the current roadmap.
4. Run the required checks before opening a pull request.
5. Open a pull request with a clear summary and validation notes.

## Required Checks

Backend:

```bash
cd backend
./mvnw clean test
./mvnw clean package
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

## Code Standards

- Do not commit real secrets or local credentials.
- Prefer DTOs over exposing entities in API responses.
- Keep Flyway responsible for schema evolution.
- Keep frontend API access inside services and hooks.
- Avoid adding modules outside the approved roadmap.
- Add or update tests for behavior changes.

## Pull Request Guidelines

Include:

- What changed.
- Why it changed.
- How it was tested.
- Screenshots for frontend changes when applicable.
