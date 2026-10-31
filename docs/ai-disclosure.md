# AI Assistance Disclosure

## Purpose

AI tools were used as development support during the Apex Operations API assessment. The implementation, local execution, testing, troubleshooting, and verification activities were carried out and reviewed by the candidate.

## Areas Where AI Assistance Was Used

AI assistance was used for:

1. **Technical guidance:** Understanding Docker, Docker Compose, CI/CD workflows, application health checks, readiness checks, and observability concepts.
2. **Implementation support:** Helping structure application files, review configuration, and troubleshoot Node.js, Express, PostgreSQL, Docker, and GitHub Actions issues.
3. **Testing guidance:** Supporting the development and review of automated API tests, including simulated database failure scenarios.
4. **Documentation:** Helping draft and improve the README, architecture documentation, release and rollback runbook, and engineering decision memo.
5. **Security review:** Discussing environment-variable handling, non-root container execution, dependency auditing, and least-privilege practices.

## Candidate Verification and Responsibility

The candidate reviewed the implementation, executed the commands, and verified the results locally.

Verification included:

- Running ESLint and automated tests.
- Building the Docker image.
- Deploying the API and PostgreSQL using Docker Compose.
- Checking application health and database readiness.
- Inspecting structured logs and metrics.
- Simulating a database outage and restoring database connectivity.
- Deploying versioned images and demonstrating rollback.

AI-generated suggestions were treated as assistance rather than proof of successful execution. Technical claims in this submission are based on actual implementation and observed results.

## Limitations

AI assistance does not replace independent engineering judgment. The candidate remains responsible for the submitted code, configuration, documentation, security decisions, and demonstration evidence.
