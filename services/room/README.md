# Room service

Owner: Member 3. Status: TODO scaffold; this service does not run yet.

Own room types, current prices, room inventory and staff-only activation changes. Database: `pawinn_room`; suggested port: 3002.

## Start here

1. Read [the team plan](../../docs/team.md) and [API agreement](../../docs/api.md).
2. Install Express and pg in this folder; add authentication/test dependencies only as needed. Let npm generate `package-lock.json` and commit it with your implementation.
3. Implement `db.js`, `schema.sql` and invented sample data in `seed.sql`.
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
| `schema.sql` | Initial tables/constraints for room_types and rooms |
| `seed.sql` | Invented demo data |
| `tests/` | Service behavior tests |
| `Dockerfile` | Build this service's image after it works locally |

Use `PORT` and `DATABASE_URL`; authentication uses the team's agreed token settings. Booking also needs account/room URLs. Copy only the values your service needs from the root environment template. Document a safe schema-update process when tables change; initial SQL is not an automatic migration system.

Keep this flat. Add another file only when it makes the code easier to follow.
