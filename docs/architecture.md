# PawInn architecture

## Keep it small

PawInn is a college project with an HTML/Tailwind/Alpine frontend and three independently runnable Node/Express services. All code lives in this repository.

| Application | Owner | Suggested port | Owns |
| --- | --- | --- | --- |
| Frontend | Member 1 | 8080 in Docker; 4173 for current preview | Customer/staff pages and API adapters |
| Account service | Member 2 | 3001 | Users, login, roles and pets |
| Room service | Member 3 | 3002 | Room types, prices and physical rooms |
| Booking service | Member 4 | 3003 | Availability, bookings, mock payment/refund, cancellation requests and logs |

## Shared PostgreSQL setup

- The main `compose.yaml` currently starts one PostgreSQL instance. Member 3 adds the frontend, three services and Nginx proxy when they are implemented.
- One PostgreSQL container holds the single shared `pawinn` application database. All three services use the same `POSTGRES_DB` setting and the same seven tables in the default public schema. See [database setup](../database/README.md).
- All SQL lives in `database/`. The PostgreSQL image creates `POSTGRES_DB`; `init.sql` loads account, room and booking schemas before their seeds. The three SQL folders group work by teammate; they are not separate databases or PostgreSQL schemas.
- Use one local-demo login for simplicity. Each service primarily writes its own tables; shared reads/joins are allowed. Table ownership is a team agreement, not a database permission boundary. Each teammate runs their own local instance, not a shared remote database.
- `infra/nginx.conf` will route `/api/auth`, `/api/users` and `/api/pets` to account; `/api/room-types` and `/api/rooms` to room; `/api/availability`, `/api/bookings` and `/api/cancellations` to booking.
- The proxy will serve the frontend origin by forwarding other paths to the frontend container. Its Nginx config serves static assets.
- Booking can read/join users, pets, rooms and room_types directly in the shared database to verify ownership, active inventory and prices. Internal HTTP calls are not required just to look up these rows.
- Define normal foreign keys from bookings to users/pets/rooms, pets to users, rooms to room_types, and cancellations/logs to bookings and relevant users. Agree matching ID types and preserve booking history when records are deleted.
- This is a shared-database service architecture. The three Express apps can run separately, but schema changes are coupled and must be coordinated.
- Booking owns date availability. It must prevent overlapping reservations atomically, including two requests arriving together. Checkout dates are exclusive: a new stay can begin on a previous stay's checkout date.
- The frontend calls the services' HTTP APIs. No message broker, service discovery platform or extra payment service is needed.

## Files inside a service

- `server.js`: load environment settings, create Express, attach routes/error handling, expose health and listen on the service port.
- `routes.js`: HTTP routes, input validation, authentication/role checks and short handlers.
- `db.js`: PostgreSQL connection pool and SQL queries.
- `database/<service>/schema.sql`: initial tables and constraints, outside the service folder.
- `database/<service>/seed.sql`: invented demo data, also outside the service folder.
- `tests/`: meaningful tests of service behavior.
- `Dockerfile`: container build, after the owner implements the service.

Split a file only when it becomes hard to follow. Booking may eventually benefit from one `booking.js` for its business rules; there is no requirement to pre-create layers.

## Authentication and payment

The team should use one agreed authentication format across all three services; the starting API agreement uses bearer tokens. Account hashes passwords, issues tokens and controls roles. Every service validates tokens and checks access on the backend. Browser-only demo role checks are not authorization.

Checkout and refunds remain simulated for the course. Do not collect card details or connect a real payment provider.

## Delivery

GitHub Actions runs checks. Jenkins runs on a local machine with access to Docker, checks out the repository and deploys the application using Compose. Deploy after a successful CI result; keep the check tied to the commit being deployed. Teammates' personal machines do not need to run Jenkins.

## Current status

The frontend works with browser-local demo data. PostgreSQL startup and database creation are implemented. Backend source, table/seed SQL, proxy configuration and pipeline files remain clearly marked TODO starter files. They do not start an integrated system yet.
