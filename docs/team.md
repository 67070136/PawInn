# PawInn: work plan for four people

Keep this college project small: one frontend, three Express services, one PostgreSQL container with three databases, and one application Compose file. PostgreSQL startup/database creation works; backend, table/seed SQL and pipeline files are starter guides.

## Ownership

Replace the member labels with your names. Each person owns their folder, its tests, and its documentation.

| Person | Main folder | Deliverables | Shared responsibility |
| --- | --- | --- | --- |
| You / Member 1 | `frontend/` | Connect the existing pages to real APIs; loading, error and empty states; customer and staff journeys | Coordinate integration, README, diagrams and demo |
| Member 2 | `services/account/` + `database/account/` | Registration/login, customer/staff identity, user profile, pet CRUD and ownership, users/pets schema and seed data | Agree the authentication format with both backend teammates |
| Member 3 | `services/room/` + `database/room/` | Room types, room inventory, prices, active/inactive rooms, schema, seeds and tests | Own `compose.yaml`, `database/init.sql`, `infra/`, `.github/workflows/`, `Jenkinsfile` and `.env.example` |
| Member 4 | `services/booking/` + `database/booking/` | Availability, reservations, price calculation, mock checkout, history, cancellations, staff decisions and booking logs | Lead the final booking/payment/cancellation integration check |

Room has fewer business rules, so its owner also handles Docker and CI/CD. Booking is the largest feature: Member 1 should help exercise and integrate its flows once account and room integration work.

## Before coding

1. Read your service README, [database setup](../database/README.md), [architecture](architecture.md) and the [API agreement](api.md).
2. Agree the endpoint names, JSON field names, IDs, dates and authentication before connecting services.
3. Keep the existing frontend demo working until real API integration replaces it.
4. Implement one small feature at a time; add a file only when it has a real job.
5. Edit schema/seed SQL only in `database/<your-service>/`. Each teammate starts their own local PostgreSQL container; each service selects its own database on that instance.

## Implementation order

### 1. Independent setup

- Member 1: run the existing frontend; identify the adapters in `src/js/api/` and direct demo reads in `src/js/stores/session.js` and page modules.
- Member 2: create users/pets tables and seeds; implement health, registration/login and pet ownership checks.
- Member 3: create room types/rooms tables and seeds; implement health and room browsing. Prepare Docker and the pipeline after service start/test commands are agreed.
- Member 4: create bookings/cancellation/log tables and seeds; implement date validation and availability using agreed account/room example responses.

Account and room work can proceed while booking uses small temporary test fixtures. Do not require the other services to be finished to begin.

### 2. First working journey

- Connect account login and pets to the frontend.
- Connect room browsing and date availability.
- Connect reservation creation, booking history and mock checkout.
- Verify prices are calculated by the backend and simultaneous requests cannot double-book a room.
- Member 3 wires up all applications and PostgreSQL in Compose.

### 3. Cancellation and delivery

- Add customer cancellation requests and staff approve/decline.
- Approval cancels the booking, releases availability and records a full mock refund once.
- GitHub Actions runs frontend build/tests and each backend's tests once they exist.
- Jenkins builds and starts the application on the local Docker machine, then checks health.
- All four run [the integration checklist](../tests/README.md) and rehearse the demo.

Do not duplicate a whole CI pipeline in Jenkins. GitHub Actions checks code; Jenkins deploys the local demo. A container registry is optional for this course setup.

## GitHub workflow

1. Each member clones this same repository; do not make four separate repositories.
2. Start from current `main`: `git switch main`, then `git pull --ff-only origin main`.
3. Create one branch per task, such as `feature/account-login`, `feature/room-list`, `feature/booking-checkout` or `feature/frontend-pets`.
4. Commit and push that branch, then open a pull request into `main`.
5. Ask one teammate to review it. Include what changed, how to run it and the tests/checks performed.
6. Merge small, working changes and update local `main` before the next task.

Only Member 3 edits shared deployment files by default. Discuss changes to `docs/api.md` with the affected owner first. This is an ownership agreement, not a technical permission restriction.

## Definition of done for a feature

- The feature works through its API and the relevant frontend page.
- Invalid input and unauthorized access produce useful errors.
- Important rules have meaningful tests; sample data uses invented details.
- Start/test commands and required environment variables are documented.
- The pull request is reviewed and does not break the existing demo.

## Restructure record

The simplification preserves the frontend and flat backend folders. Database SQL is centralized under `database/` by service owner. One Compose PostgreSQL instance creates three databases. Backend application logic, table definitions, room inventory and CI/CD are still implementation tasks; the agreed room seed target is five rooms per type (15 total).
