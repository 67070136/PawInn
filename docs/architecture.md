# PawInn architecture

## Keep it small

PawInn is a college project with an HTML/Tailwind/Alpine frontend and three independently runnable Node/Express services. All code lives in this repository.

| Application | Owner | Suggested port | Owns |
| --- | --- | --- | --- |
| Frontend | Member 1 | 8080 in Docker; 4173 for current preview | Customer/staff pages and API adapters |
| Account service | Member 2 | 3001 | Users, login, roles and pets |
| Room service | Member 3 | 3002 | Room types, prices and physical rooms |
| Booking service | Member 4 | 3003 | Availability, bookings, mock payment/refund, cancellation requests and logs |

## Planned local setup

- One main `compose.yaml` starts the frontend, the three services, PostgreSQL and an Nginx API proxy.
- One PostgreSQL container holds `pawinn_account`, `pawinn_room` and `pawinn_booking`. Each service accesses only its own database.
- `infra/nginx.conf` will route `/api/auth`, `/api/users` and `/api/pets` to account; `/api/room-types` and `/api/rooms` to room; `/api/availability`, `/api/bookings` and `/api/cancellations` to booking.
- The proxy will serve the frontend origin by forwarding other paths to the frontend container. Its Nginx config serves static assets.
- Booking calls account to check pet ownership and room to read active rooms and prices. Store IDs for references to other services; do not create cross-database foreign keys or read another service's database.
- Booking owns date availability. It must prevent overlapping reservations atomically, including two requests arriving together. Checkout dates are exclusive: a new stay can begin on a previous stay's checkout date.
- Use simple HTTP calls with timeouts. No message broker, service discovery platform or extra payment service is needed.

## Files inside a service

- `server.js`: load environment settings, create Express, attach routes/error handling, expose health and listen on the service port.
- `routes.js`: HTTP routes, input validation, authentication/role checks and short handlers.
- `db.js`: PostgreSQL connection pool and SQL queries.
- `schema.sql`: initial tables and constraints for this service.
- `seed.sql`: invented demo data.
- `tests/`: meaningful tests of service behavior.
- `Dockerfile`: container build, after the owner implements the service.

Split a file only when it becomes hard to follow. Booking may eventually benefit from one `booking.js` for its business rules; there is no requirement to pre-create layers.

## Authentication and payment

The team should use one agreed authentication format across all three services; the starting API agreement uses bearer tokens. Account hashes passwords, issues tokens and controls roles. Every service validates tokens and checks access on the backend. Browser-only demo role checks are not authorization.

Checkout and refunds remain simulated for the course. Do not collect card details or connect a real payment provider.

## Delivery

GitHub Actions runs checks. Jenkins runs on a local machine with access to Docker, checks out the repository and deploys the application using Compose. Deploy after a successful CI result; keep the check tied to the commit being deployed. Teammates' personal machines do not need to run Jenkins.

## Current status

The frontend works with browser-local demo data. Backend source, SQL, container/proxy configuration and pipeline files are clearly marked TODO starter files. They do not start an integrated system yet.
