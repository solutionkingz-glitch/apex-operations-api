# Assessment Evidence

This directory contains screenshots captured during the implementation and verification of the Apex Operations API DevOps assessment.

## Evidence Index

| Screenshot | Description |
|---|---|
| 01-ci-success.png | Successful GitHub Actions execution showing code quality, tests, and Docker image build. |
| 02-ci-failure-gate.png | Intentional test failure demonstrating that the Docker image build is skipped when quality checks fail. |
| 03-docker-services.png | Docker Compose showing the API and PostgreSQL services running and healthy. |
| 04-api-health-metrics.png | API liveness, database readiness, and Prometheus-compatible metrics endpoints. |
| 05-database-outage.png | Controlled database outage resulting in HTTP 503 from the readiness endpoint. |
| 06-database-recovery.png | Successful database recovery, with the readiness endpoint returning HTTP 200. |
| 07-version-rollback.png | Versioned deployment and rollback verification, demonstrating a return from version 1.0.1 to version 1.0.0. |

## Verification Notes

- Tests were executed locally and through GitHub Actions.
- The intentional failure was introduced on a separate assessment branch and was not merged into `main`.
- The database outage and recovery were performed in a local Docker Compose environment.
- Version deployment and rollback were verified through the API root endpoint.
- No Apex production systems, customer data, credentials, or paid cloud resources were used.
- Screenshots are supporting evidence; implementation details and reproducible procedures are documented in the README and `docs/` directory.
