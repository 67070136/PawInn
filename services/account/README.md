# Account service

Owner: Member 2. Status: TODO scaffold; this service does not run yet.

Own registration/login, password hashing, role checks, user profile and pet ownership. Shared database: `pawinn`; suggested port: 3001.

## Start here

1. Read [the team plan](../../docs/team.md) and [API agreement](../../docs/api.md).
2. Install Express and pg in this folder; add authentication/test dependencies only as needed. Let npm generate `package-lock.json` and commit it with your implementation.
3. Start PostgreSQL using [the database guide](../../database/README.md). Implement `db.js`, [your schema](../../database/account/schema.sql) and [sample data](../../database/account/seed.sql).
4. Implement `routes.js` and `server.js`, including `GET /health`, input checks and backend access checks.
5. Add working `start` and `test` scripts to `package.json`; document the commands here.
6. Add meaningful tests in `tests/` and implement your Dockerfile.
7. Update the API agreement with one request/response example; coordinate integration with Member 1.

## File responsibilities

| File | Job |
| --- | --- |
| `server.js` | Express setup, environment settings, error handler, health, listen/shutdown |
| `routes.js` | Routes, short handlers, validation and access checks |
| `db.js` | PostgreSQL pool and SQL queries for this service only |
| `../../database/account/schema.sql` | Initial tables/constraints for users and pets |
| `../../database/account/seed.sql` | Invented demo data |
| `tests/` | Service behavior tests |
| `Dockerfile` | Build this service's image after it works locally |

Read `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB` from root environment settings. All three services select the same database (`pawinn` by default) in their pg pools. The shared instance is on localhost for Node processes running on your computer; future Compose service containers use host `postgres` and port 5432. The owner must load/pass environment variables at startup; Node does not automatically load root `.env`. Authentication uses the agreed token settings. Shared reads and SQL joins are allowed; booking does not need internal account/room HTTP calls just to verify pet ownership or read room information.

Keep all SQL in `database/account/`, not duplicated here. This folder groups ownership; its tables live alongside the other services' tables in the same public schema. Primarily write your own tables and coordinate changes to referenced columns with affected teammates. Document safe incremental updates once tables contain data; initial SQL is not an automatic migration system.

Keep this flat. Add another file only when it makes the code easier to follow.
