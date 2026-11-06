# One shared PostgreSQL instance

PawInn uses one PostgreSQL container with three databases. This does not mean one shared set of tables.

| Database | SQL folder | Owner | Tables to implement |
| --- | --- | --- | --- |
| `pawinn_account` | `account/` | Member 2 | users, pets |
| `pawinn_room` | `room/` | Member 3 | room_types, rooms |
| `pawinn_booking` | `booking/` | Member 4 | bookings, cancellation_requests, booking_logs |

Each folder contains `schema.sql` and `seed.sql`. The service owner edits those files along with their JavaScript in `services/`. There are no duplicate SQL copies in the service folders.

## Start the database

From the repository root, using PowerShell:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
docker compose ps
```

Copy the template only if you do not already have a `.env`; keep existing local settings. Set the local password before starting.

The Compose service publishes PostgreSQL on `127.0.0.1:5432` by default. Set `POSTGRES_PORT` in `.env` if that port is already in use. The data is stored in the named `postgres_data` volume.

`init.sql` creates the three databases and loads each folder's schema then seed. Currently, those six files contain TODO notes: the databases start empty, and no tables or real backend functionality are implemented.

## Connect a service or database GUI

| Setting | Node service running on your computer | Future Node container in Compose |
| --- | --- | --- |
| Host | POSTGRES_HOST from .env, default 127.0.0.1 | postgres |
| Port | POSTGRES_PORT from .env, default 5432 | 5432 |
| User/password | POSTGRES_USER / POSTGRES_PASSWORD | Same local-demo values |
| Database | That service's database from the table above | Same service database |

Each `services/<name>/db.js` will create a pg pool using these settings and its fixed database name. Node does not automatically read the root `.env`; the service owner must load it or pass the variables when implementing startup. Compose reads root `.env` for its own configuration.

The local demo uses one database login for simplicity. Service ownership is an agreement between the team, not database permission isolation. Services must query their own database and use HTTP APIs for other services' data. IDs referring to another service are not cross-database foreign keys.

## Independent development

Each teammate runs their OWN local copy of this PostgreSQL container. One instance means one per local application environment, not a remotely shared server that every teammate must depend on.

Members 2, 3 and 4 implement their own SQL folders. Member 3 maintains `init.sql`, `compose.yaml` and shared configuration. Agree ID types and sample references before coding.

## Existing data and later SQL edits

Docker initialization runs only for a fresh data directory. Restarting the container does not apply edited SQL files. Apply reviewed changes explicitly to the correct database; do not delete your volume to update a schema.

For example, with the template user `pawinn`, apply a reviewed account schema script:

```powershell
docker compose exec -T postgres psql -U pawinn -d pawinn_account -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/account/schema.sql
```

Use your configured user if different. This example runs the entire file: once tables contain data, write incremental SQL updates rather than rerunning destructive CREATE/DROP or seed statements. Keep any deliberate schema updates with the owning database's SQL files.

Stop the database with `docker compose down`; this keeps its data volume. No database reset is needed for this restructuring.

## Room inventory

The agreed seed target is five rooms of each type: Cozy Den C101-C105, Garden Suite G101-G105 and Cat Loft L101-L105 (15 physical rooms). Member 3 implements that inventory in `room/seed.sql` after the schema exists. The current standalone frontend still uses its earlier two-per-type demo inventory; Member 1 updates it when integrating or refreshing the demo.

## Scope

Only the PostgreSQL service is runnable in Compose today. Backend containers, proxy integration and CI/CD still need implementation. Continue running the existing frontend separately as described in the root README.

References: [official PostgreSQL image initialization](https://hub.docker.com/_/postgres) and [Docker Compose environment interpolation](https://docs.docker.com/reference/compose-file/interpolation/).
