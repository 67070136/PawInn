# booking service tests

Owner: Member 4. Add real tests when implementing the service; there are no backend tests yet.

Cover invalid/adjacent dates, room/pet conflicts including simultaneous requests, server-calculated prices, hold expiry, checkout retry/idempotency, cancellation ownership and staff review/refund idempotency.

Use Node's built-in test runner if it is sufficient. Test against a disposable shared test database (for example, set POSTGRES_DB=pawinn_test), never demo data that someone needs. Load referenced schemas/fixtures in account, room, booking order when needed for foreign keys. The service owner adds the test script and any setup instructions to package.json and the service README.
