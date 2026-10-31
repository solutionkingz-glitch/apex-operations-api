# Apex Operations API – Architecture

## 1. Overview

The Apex Operations API is a containerized Node.js and Express application backed by PostgreSQL.

Docker Compose manages the application and database services, including service health checks, networking, configuration, and persistent database storage.

GitHub Actions provides continuous integration by running code quality checks, automated tests, a production dependency audit, and a Docker image build.

## 2. Architecture Diagram

```mermaid
flowchart TB
    DEV[Developer]
    GH[GitHub Repository]
    CI[GitHub Actions CI]

    subgraph LOCAL["Docker Compose Environment"]
        API["Apex Operations API<br/>Node.js / Express<br/>Non-root user"]
        DB[("PostgreSQL 17<br/>Persistent Volume")]
    end

    CLIENT[API Client]
    METRICS[Prometheus-compatible Metrics]
    LOGS[Structured JSON Logs]

    DEV --> GH
    GH --> CI
    CI -->|Lint, Tests, Audit, Image Build| CI

    CLIENT -->|HTTP Requests| API
    API -->|SQL Queries| DB
    DB -->|Query Results| API

    API -->|/metrics| METRICS
    API -->|Request Events| LOGS

    API -->|/health and /ready| CLIENT
