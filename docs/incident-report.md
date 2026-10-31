# Incident Report: PostgreSQL Availability Failure

## 1. Incident Summary

A controlled database availability failure was simulated
to verify the application's readiness detection and recovery
behaviour.

## 2. Environment

- Application: Apex Operations API
- Runtime: Node.js 24
- Container platform: Docker Compose
- Database: PostgreSQL 17
- API port: 3000

## 3. Failure Simulation

The database container was stopped using:

    docker compose stop db

The API remained running, but its readiness endpoint returned:

    HTTP 503 Service Unavailable

Response:

    {"status":"not ready","database":"unavailable"}

This confirmed that the application detected the database
connection failure without terminating the API process.

## 4. Recovery Procedure

The database was restarted using:

    docker compose start db

The PostgreSQL health check subsequently reported healthy.

The readiness endpoint returned:

    HTTP 200 OK

Response:

    {"status":"ready","database":"connected"}

## 5. Root Cause

The database service was deliberately stopped as part of a
controlled failure simulation. This was not an unexpected
production incident.

## 6. Resolution

The PostgreSQL container was restarted. Database connectivity
was restored, and the API returned to a ready state.

## 7. Lessons Learned

- Application liveness and readiness are different.
- A running API does not necessarily mean it can serve requests.
- Dependency health checks improve service visibility.
- Persistent database storage supports recovery across
  container restarts.
- Readiness endpoints help orchestrators identify services
  that should temporarily receive no traffic.
## 8. Evidence and Verification

The following observations confirmed the failure and recovery:

| Check | Expected Result | Observed Result |
|---|---|---|
| Stop database container | Database unavailable | Confirmed |
| API liveness | HTTP 200 | API remained running |
| Database readiness during outage | HTTP 503 | Confirmed |
| Restart database container | Database healthy | Confirmed |
| Database readiness after recovery | HTTP 200 | Confirmed |

The failure and recovery were verified using the API readiness endpoint and Docker Compose service status.

This was a controlled local test using synthetic data, not a production incident.
