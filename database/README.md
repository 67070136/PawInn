# One shared PostgreSQL database

PawInn uses one PostgreSQL container and one application database, `pawinn`. All seven planned tables live together in its default `public` schema. Account, Room and Booking remain separate Express services, all connecting to this same database.

| SQL folder | Owner | Tables to implement |
| --- | --- | --- |
| `account/` | Member 2 | users, pets |
| `room/` | Member 3 | room_types, rooms |
| `booking/` | Member 4 | bookings, cancellation_requests, booking_logs |

These folders organize teammates' work; they are not separate databases or PostgreSQL schemas. Each contains `schema.sql` and `seed.sql`. Service owners edit those files alongside their JavaScript in `services/`.

## Start the database

From the repository root in PowerShell, copy the template only if you do not already have `.env`, then set your local password:

```powershell
Copy-Item .env.example .env
docker compose up -d postgres
docker compose ps
```

Keep existing local settings. For an existing `.env`, add `POSTGRES_DB=pawinn` and remove obsolete per-service database names.

PostgreSQL is published on `127.0.0.1:5432` by default. Change `POSTGRES_PORT` if that port is occupied. Data persists in the named `postgres_data` volume.

On a fresh data directory, the official PostgreSQL image creates the database named by `POSTGRES_DB`. `init.sql` loads account, room and booking table definitions in that order, then their seeds in the same order. This lets foreign keys reference parent tables and seed rows that already exist. All six schema/seed files are still TODO starters: startup creates the shared database, not the application's tables.

## Connect every service or a database GUI

| Setting | Node running on your computer | Future Node container in Compose |
| --- | --- | --- |
| Host | POSTGRES_HOST, default 127.0.0.1 | postgres |
| Port | POSTGRES_PORT, default 5432 | 5432 |
| User/password | POSTGRES_USER / POSTGRES_PASSWORD | Same values |
| Database | POSTGRES_DB, default pawinn | Same database |

All three `services/<name>/db.js` files will create a pg pool using the same settings, including `POSTGRES_DB`. Node does not automatically read the root `.env`; service owners must load it or pass its settings at startup. Compose uses root `.env` for its own configuration.

One local-demo login can access all tables. Ownership is a team agreement, not database permission isolation. Each service normally writes its own tables. Shared reads and joins are allowed where useful, such as Booking checking pets, rooms and prices. Authentication, roles and ownership must still be checked by every protected API.

## Primary keys and foreign keys

Every table needs its own primary key. Define real foreign keys between related tables in this database:

- pets.owner_id references users.user_id.
- rooms.room_type_id references room_types.room_type_id.
- bookings.user_id, pet_id and room_id reference users, pets and rooms.
- cancellation_requests.booking_id and booking_logs.booking_id reference bookings.
- cancellation_requests.reviewed_by and booking_logs.actor_user_id reference users; allow null where the ER diagram requires it.

Agree matching ID types before implementing these constraints. Foreign keys ensure referenced rows exist; they do not check pet ownership, date conflicts, payment rules or staff authorization. Those rules still belong in the services.

Preserve booking history. Avoid cascading deletion of a user, pet or room into its bookings. The simplest approach is to reject deletion of referenced records and deactivate rooms instead; agree any future archive behavior together.

## Working as four people

Each teammate runs their own local copy of the application and this database. One shared database means shared by that environment's services, not one remote database that all teammates must use.

Members 2, 3 and 4 own their SQL folders. Member 3 maintains `init.sql`, Compose and shared settings. Account and room schemas must exist before booking's foreign keys can be created. The booking owner can use agreed test fixtures while those schemas are being implemented. Review changes to referenced columns with affected teammates.

## Existing volumes and SQL changes

Docker initialization runs only for a fresh data directory. Changing `POSTGRES_DB` or restarting does not migrate existing data or apply edited SQL.

If you already ran the older separate-database setup, keep its databases and volume. After taking a backup, create the new `pawinn` database if missing, using a database GUI or, with the sample login:

```powershell
docker compose exec -T postgres psql -U pawinn -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE pawinn;"
```

Run that only if `pawinn` does not exist. Implement/review the schemas before applying them. Any existing application data needs an explicit reviewed transfer; this repository change does not copy or delete it.

For a reviewed account schema script, using the sample username and shared database:

```powershell
docker compose exec -T postgres psql -U pawinn -d pawinn -v ON_ERROR_STOP=1 -f /docker-entrypoint-initdb.d/account/schema.sql
```

Use your configured username/database if different. Initial schema and seed files are not an automatic migration system. Once tables hold data, apply incremental SQL updates rather than rerunning destructive statements.

`docker compose down` stops the setup and keeps its data volume. Do not remove a volume to apply this change.

## Room inventory and current scope

The agreed seed target is five rooms per type: Cozy Den C101-C105, Garden Suite G101-G105 and Cat Loft L101-L105 (15 rooms). Member 3 implements this in `room/seed.sql`. The standalone frontend still uses its earlier two-per-type demo inventory; Member 1 updates it when integrating or refreshing the demo.

Only PostgreSQL is currently runnable in Compose. Backend implementations, table/seed SQL, proxy integration and CI/CD remain team tasks. The existing frontend runs independently using local demo data.

References: [official PostgreSQL image initialization](https://hub.docker.com/_/postgres), [PostgreSQL foreign keys](https://www.postgresql.org/docs/17/ddl-constraints.html#DDL-CONSTRAINTS-FK) and [Docker Compose interpolation](https://docs.docker.com/reference/compose-file/interpolation/).
