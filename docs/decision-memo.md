# Apex Operations API – Engineering Decision Memo

## 1. Project Objective

The objective was to build a containerized operations API with a repeatable deployment process, automated quality checks, database persistence, basic observability, and a documented rollback procedure.

The implementation prioritizes simplicity, security, reproducibility, and cost awareness.

## 2. Technology Decisions

| Technology | Decision | Reason |
|---|---|---|
| Node.js 24 | Application runtime | Provides a lightweight environment for the REST API. |
| Express 5 | API framework | Simplifies HTTP routing and middleware implementation. |
| PostgreSQL 17 | Database | Provides relational storage and reliable transactions. |
| Docker | Containerization | Packages the application and its runtime dependencies. |
| Docker Compose | Local orchestration | Manages the API, database, networking, and persistent storage. |
| GitHub Actions | CI automation | Automates linting, testing, auditing, and image builds. |
| Jest and Supertest | Testing | Support automated API and endpoint tests. |
| ESLint | Code quality | Identifies code-quality issues before integration. |

## 3. Deployment Strategy

Docker Compose was selected for the assessment because it provides a reproducible local deployment without requiring paid cloud infrastructure.

The API and database run as separate services. The API waits for PostgreSQL to become healthy before starting its dependent service workflow.

Versioned Docker images support controlled releases and rollback to a previously built image.

The CI pipeline builds the image only after the quality job succeeds. The current pipeline does not publish the image or perform automatic cloud deployment.

## 4. Security Decisions

### Secrets management

- Local environment variables are supplied through `.env`.
- `.env` is excluded from Git using `.gitignore`.
- Docker build context excludes environment files through `.dockerignore`.
- `.env.example` provides configuration placeholders without real credentials.
- Production secrets should be stored in a managed secrets service or protected CI/CD secret store.

### Least privilege

- The API container runs as the non-root `node` user.
- PostgreSQL is not directly exposed on the host.
- GitHub Actions uses read-only repository permissions.
- Database access is limited to the credentials configured for the application.

### Dependency and image security

- CI runs `npm audit --omit=dev` to check production dependencies.
- The production dependency audit currently reports no vulnerabilities.
- A full development dependency audit identified low-severity findings. These are documented rather than forcing potentially breaking dependency changes.
- The current pipeline does not yet perform automated container image vulnerability scanning.
- A production pipeline should add an image scanner such as Trivy and establish an appropriate vulnerability policy.

## 5. Observability Decisions

The API provides:

- `/health` for application health.
- `/ready` for database readiness.
- `/metrics` for Prometheus-compatible request metrics.
- Structured JSON request logs containing timestamps, methods, paths, response codes, and durations.

The metrics are maintained in application memory. They reset when the container restarts.

For production, I would integrate persistent metrics collection, centralized logging, dashboards, and alerting.

Suggested alerts include:

- Repeated HTTP 5xx responses.
- API availability failures.
- Database connection failures.
- High request latency.
- Sustained resource utilization.

## 6. Failure Investigation

A controlled database outage was simulated by stopping the PostgreSQL container.

The API readiness endpoint returned HTTP 503 while the database was unavailable.

After PostgreSQL was restarted and became healthy, the readiness endpoint returned HTTP 200.

This demonstrated that the readiness check detects database connectivity problems rather than reporting the API as ready simply because its process is running.

## 7. Cost-Aware Cloud Deployment Path

No paid cloud resources were required for this assessment.

A future deployment could use:

- A small AWS EC2 instance or equivalent low-cost virtual machine.
- A container registry for versioned application images.
- Managed PostgreSQL when operational requirements justify its cost.
- Cloud monitoring and centralized logging.
- Restricted IAM roles and network access rules.

The initial deployment should remain small and scale only when actual traffic, availability, and operational requirements justify additional infrastructure.

## 8. Known Limitations and Future Improvements

1. Add automated container image vulnerability scanning.
2. Add persistent metrics storage and centralized log aggregation.
3. Introduce database migration management and backward-compatible migration procedures.
4. Publish versioned images to a container registry.
5. Add a protected deployment environment with approval controls.
6. Introduce automated alerts and production monitoring.
7. Add stronger API input validation and rate limiting where required.

## 9. Engineering Conclusion

The implementation demonstrates a reproducible containerized API, automated CI quality gates, database persistence, application observability, and a tested local release and rollback procedure.

The design deliberately avoids unnecessary cloud spending while establishing a foundation that can be extended into a production deployment.

The assessment implementation uses synthetic data and local infrastructure. No Apex AI Arabia production systems, customer data, credentials, or paid cloud resources were used.
