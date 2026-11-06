# account service tests

Owner: Member 2. Add API tests when implementing the service; there are no backend API tests yet. Shared schema/data checks already live in `database/tests/verify.sql`.

Cover registration/login, password hashing, rejecting STAFF registration, role checks, pet ownership, rejecting deletion of pets referenced by bookings, and active-booking species-change restrictions.

Use Node's built-in test runner if it is sufficient. Test against a disposable shared test database (for example, set POSTGRES_DB=pawinn_test), never demo data that someone needs. Load referenced schemas/fixtures in account, room, booking order when needed for foreign keys. The service owner adds the test script and any setup instructions to package.json and the service README.
