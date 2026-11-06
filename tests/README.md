# Whole-project integration checks

Owner: all four teammates; Member 1 coordinates the demo and Member 4 leads booking checks.

These are manual acceptance checks until the real services exist. Add automated end-to-end tests here later only if they help. Frontend tests stay in `frontend/tests/`; each backend's tests stay in its own `tests/` folder.

- Register/sign in; incorrect passwords fail; the public user response contains no password/hash.
- Customer A cannot read, edit, delete, reserve for or pay for Customer B's data, even though the services share a database.
- Once schemas exist, verify real FKs reject invalid user/pet/room/booking references and referenced-record deletion preserves booking history.
- Add/edit a pet; reject deleting a pet referenced by a booking, and prevent incompatible species changes while it has active bookings.
- Browse active rooms and check valid/invalid dates.
- Reserve a compatible room; reject unavailable rooms and simultaneous overlapping reservations.
- Allow an adjacent stay beginning on the previous checkout date.
- Reject overlapping stays for the same pet, even in different rooms.
- Calculate prices on the server; a changed browser total is ignored.
- A failed mock payment can be retried; successful retries do not duplicate payment.
- An expired unpaid reservation releases the room.
- Customer requests cancellation; customer cannot approve their own request.
- Staff approval cancels the booking, records one full mock refund and releases inventory.
- Staff decline leaves the booking confirmed; history/timeline shows the decision.
- Start the single PostgreSQL service through Docker Compose; verify all three service connection settings target the same application database, pawinn.
- Once backend integration exists, start the complete application through Docker Compose.
- Show successful GitHub Actions checks and a Jenkins local deployment/health check.
- Run customer and staff journeys at desktop and mobile sizes.
