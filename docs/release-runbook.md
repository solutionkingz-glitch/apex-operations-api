# Release and Rollback Runbook

## Purpose

This runbook describes how to build, deploy, verify, and roll back versioned releases of the Apex Operations API using Docker Compose.

## Prerequisites

- Docker Desktop with WSL 2 integration enabled.
- Docker Compose.
- A valid local `.env` file.
- The required Docker images available locally.

## 1. Build a release

Set the desired image version and build it:

```bash
IMAGE_TAG=1.0.1 docker compose build api
