# PawInn API agreement

This is the team's starting contract, not a list of implemented endpoints. Confirm it together before coding. If an endpoint changes, update this file and tell its consumers.

## Shared conventions

- JSON request/response bodies; camelCase field names.
- IDs are opaque strings at the HTTP boundary; agree the database type before writing schemas.
- Dates: `YYYY-MM-DD`. Timestamps: ISO 8601. Check-out must be after check-in.
- Currency: THB. Store database money as exact decimal values or integer satang; never trust a total sent by the browser.
- Proposed authentication: `Authorization: Bearer <token>`. Account owns token issuance; each service validates it and enforces roles/ownership.
- Success: `{"data": ...}`. Error: `{"message": "A useful explanation"}`.
- Use 201 for creation; 200 for normal success; 204 for successful deletion; 400 invalid input; 401 unauthenticated; 403 forbidden; 404 missing; 409 conflicting state.
- Each service exposes `GET /health`.
- Keep these shapes independent of frontend demo storage; Member 1 adapts API responses to page state.

## Member 2: account

| Method/path | Behavior |
| --- | --- |
| POST /api/auth/register | Accept name, email, password and optional phone; create CUSTOMER only; return token and public user |
| POST /api/auth/login | Accept email/password; return token and public user |
| GET /api/users/me | Return the signed-in user |
| GET /api/pets | Return the customer's pets |
| GET /api/pets/:id | Return an owned pet; booking calls this with the customer's token to verify ownership |
| POST /api/pets | Create an owned pet |
| PATCH /api/pets/:id | Update an owned pet |
| DELETE /api/pets/:id | Delete only when no active booking prevents removal |

Public user: `{id, name, email, phone, role}`; never return password hashes.
Pet: `{id, ownerId, name, species, breed, birthDate, notes}`.
Roles: CUSTOMER, STAFF. Species: Dog, Cat.
Seed a staff account; registration must not accept a caller-selected STAFF role.
Account and booking owners must coordinate the active-booking check before deleting/changing a booked pet's species.

## Member 3: room

| Method/path | Behavior |
| --- | --- |
| GET /api/room-types | Return descriptions, compatible species and base prices |
| GET /api/rooms | Return room inventory; support optional roomTypeId and active filters |
| PATCH /api/rooms/:id | Staff changes active/inactive status |

Room type: `{id, name, description, species, pricePerNight}`.
Room: `{id, roomTypeId, roomNumber, isActive}`.
Start with seed SQL for inventory; add more management endpoints only if the team needs them.
Define what happens to existing reservations before allowing an occupied/reserved room to be deactivated.

## Member 4: booking

| Method/path | Behavior |
| --- | --- |
| GET /api/availability?start=...&end=... | Return `[{roomTypeId, available}]`; optionally filter species |
| POST /api/bookings | Accept petId, roomTypeId, start, end; choose an available physical room and calculate the price |
| GET /api/bookings | Customers see their own; staff can see all; support optional petId/status filters |
| GET /api/bookings/:id | Return an owned booking, or any booking for staff, including timeline and cancellation state |
| POST /api/bookings/:id/checkout | Accept outcome SUCCESS or FAILED and a payment attempt ID; simulate payment, safely handle retries |
| POST /api/bookings/:id/cancellations | Accept reason; create a customer request for an eligible booking |
| GET /api/cancellations | Staff lists requests; support optional status filter |
| PATCH /api/cancellations/:id | Staff submits decision APPROVED or DECLINED plus notes |
| PATCH /api/bookings/:id/complete | Staff completes an eligible stay after check-out |

Booking response: `{id, userId, petId, roomId, roomTypeId, start, end, nightlyRate, total, status, paymentStatus, refundStatus, createdAt}`; detail includes logs and cancellation information.
Booking statuses: PENDING, CONFIRMED, CANCELLED, COMPLETED.
Payment statuses: UNPAID, SUCCESS, FAILED.
Cancellation statuses: PENDING, APPROVED, DECLINED.
Refund statuses: NOT_REQUESTED, PENDING, SUCCESS, FAILED.

Pending reservations hold inventory for 15 minutes, then expire to CANCELLED if unpaid. Reject overlapping bookings for a room or pet. Failed payment can be retried before expiry. Repeated successful checkout/review must not charge/refund twice. Approved cancellation records a full mock refund for a paid booking and releases the room; declined requests keep it confirmed.

## First integration example

A customer signs in, loads their pets, browses room types, asks booking for availability, creates a reservation, completes mock checkout and reads booking history. Then the customer requests cancellation and staff reviews it.

Decide exact optional detail fields and example responses together before wiring the frontend. Every owner should add one real request/response example here when their first endpoint works.
