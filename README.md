# Apex Operations API

A containerized REST API built with **Node.js, Express and PostgreSQL**, with automated CI checks, Docker-based deployment, application health monitoring, structured logging, metrics and versioned release rollback.

This project demonstrates practical DevOps engineering principles through a reproducible application deployment and delivery workflow.

## 1. Project Overview

The Apex Operations API provides endpoints for creating, retrieving and managing operation records stored in PostgreSQL.

The implementation includes:

- Docker containerization with non-root execution.
- PostgreSQL database with persistent storage.
- Docker Compose service orchestration.
- GitHub Actions CI pipeline.
- Automated API tests and ESLint checks.
- Application health and database readiness endpoints.
- Structured JSON request logging.
- Prometheus-compatible metrics.
- Versioned Docker images and rollback procedure.

## 2. Technology Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 24 |
| API framework | Express 5 |
| Database | PostgreSQL 17 |
| Containerization | Docker |
| Local orchestration | Docker Compose |
| CI/CD | GitHub Actions |
| Testing | Jest and Supertest |
| Code quality | ESLint |
| Metrics format | Prometheus exposition format |

## 3. Architecture

The application runs as two separate Docker Compose services:

- **API:** Handles HTTP requests and database operations.
- **Database:** Stores operation records in PostgreSQL using persistent Docker storage.

GitHub Actions validates the application before building its Docker image.

See [Architecture Documentation](docs/architecture.md) for the architecture diagram and component details.

## 4. Repository Structure

```text
apex-operations-api/
├── .github/
│   └── workflows/
│       └── ci.yml
├── database/
│   └── init.sql
├── docs/
│   ├── ai-disclosure.md
│   ├── architecture.md
│   ├── decision-memo.md
│   ├── incident-report.md
│   └── release-runbook.md
├── screenshots/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── tests/
│   └── health.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── package.json
└── package-lock.json
```

## 5. Prerequisites

Install the following:

- Docker Desktop with WSL 2 integration, or Docker Engine.
- Docker Compose.
- Git.

## 6. Local Setup and Deployment

Clone the repository:

```bash
git clone https://github.com/solutionkingz-glitch/apex-operations-api.git
cd apex-operations-api
```

Create your local environment configuration:

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder database password with a suitable local development password.

Build and start the services:

```bash
docker compose up --build -d
```

Check service status:

```bash
docker compose ps
```

Both the API and database should become healthy.

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Application information and version |
| GET | `/health` | Application health check |
| GET | `/ready` | Database readiness check |
| GET | `/metrics` | Prometheus-compatible metrics |
| GET | `/api/operations` | Retrieve operations |
| GET | `/api/operations/:id` | Retrieve an operation by ID |
| POST | `/api/operations` | Create an operation |

### Example requests

Check application health:

```bash
curl http://localhost:3000/health
```

Check database readiness:

```bash
curl http://localhost:3000/ready
```

Retrieve operations:

```bash
curl http://localhost:3000/api/operations
```

Create an operation:

```bash
curl -X POST http://localhost:3000/api/operations \
  -H "Content-Type: application/json" \
  -d '{"name":"Infrastructure Monitoring","description":"Monitor application infrastructure","status":"pending"}'
```

View metrics:

```bash
curl http://localhost:3000/metrics
```

## 8. Automated Testing and Code Quality

Install dependencies when running the application directly outside Docker:

```bash
npm ci
```

Run ESLint:

```bash
npm run lint
```

Run automated tests:

```bash
npm test
```

Run the CI test command with coverage:

```bash
npm run test:ci
```

The automated test suite covers health checks, database readiness, API responses, input validation and simulated database failures.

The verified local test result was **11 passing tests**.

## 9. CI Pipeline

The GitHub Actions workflow is located at:

`.github/workflows/ci.yml`

The pipeline performs:

1. Repository checkout.
2. Node.js setup.
3. Dependency installation.
4. ESLint validation.
5. Automated tests with coverage.
6. Production dependency security audit.
7. Docker image build.

The image-build job depends on the successful completion of the quality job.

An intentional failing test was introduced on a separate assessment branch to demonstrate that the quality gate blocks the Docker image build. After removing the temporary test, the corrected workflow passed both jobs.

The pipeline builds the image but does not publish it to a registry or automatically deploy to a cloud environment.

## 10. Observability

The API provides three operational endpoints:

- `/health` — confirms that the application is responding.
- `/ready` — checks connectivity to PostgreSQL.
- `/metrics` — exposes request counters and request-duration metrics.

Structured JSON logs record request timestamps, HTTP methods, paths, response codes and request durations.

The current metrics are held in application memory and reset when the container restarts.

## 11. Versioned Deployment and Rollback

The application supports versioned Docker images through the `IMAGE_TAG` environment variable.

Build version 1.0.1:

```bash
IMAGE_TAG=1.0.1 docker compose build api
```

Deploy version 1.0.1:

```bash
IMAGE_TAG=1.0.1 docker compose up -d
```

Verify the deployed version:

```bash
curl http://localhost:3000/
```

Roll back to version 1.0.0:

```bash
IMAGE_TAG=1.0.0 docker compose up -d
```

Verify the restored version and database readiness:

```bash
curl http://localhost:3000/
curl http://localhost:3000/ready
```

The local rollback demonstration successfully restored version 1.0.0 after deploying version 1.0.1.

See [Release and Rollback Runbook](docs/release-runbook.md) for the full procedure.

## 12. Security Considerations

- The application container runs as a non-root user.
- Environment-specific configuration is stored in `.env`.
- `.env` is excluded from source control.
- `.dockerignore` prevents environment files from entering the Docker build context.
- PostgreSQL is not directly exposed to the host.
- GitHub Actions uses read-only repository permissions.
- Production dependencies are audited during CI.

The production dependency audit reported no vulnerabilities at the time of testing. Low-severity findings in the development dependency tree were identified and documented rather than applying potentially breaking forced upgrades.

Automated container image vulnerability scanning is a recommended future improvement.

## 13. Documentation

Additional engineering documentation:

- [Architecture](docs/architecture.md)
- [Engineering Decision Memo](docs/decision-memo.md)
- [Incident Investigation](docs/incident-report.md)
- [Release and Rollback Runbook](docs/release-runbook.md)
- [AI Assistance Disclosure](docs/ai-disclosure.md)

## 14. Limitations and Future Improvements

Potential improvements for a production deployment include:

- Automated Docker image vulnerability scanning.
- Container image publishing to a secure registry.
- Persistent metrics collection and centralized logging.
- Database migration management.
- Deployment approval controls.
- Monitoring dashboards and automated alerts.
- Cloud deployment with appropriate IAM and network restrictions.

## 15. Assessment Scope

This implementation was developed for a practical DevOps assessment using local Docker resources and synthetic data.

No Apex AI Arabia production systems, real customer data, production credentials or paid cloud resources were used.

AI assistance was used during development and documentation, as described in [AI Assistance Disclosure](docs/ai-disclosure.md).

---

**Repository:** https://github.com/solutionkingz-glitch/apex-operations-api
