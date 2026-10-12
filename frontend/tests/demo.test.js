import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  today,
  addDays,
  nights,
  overlap,
  validateDates,
  availableRooms,
  createBooking,
  expire,
  payBooking,
  requestCancellation,
  reviewCancellation,
} from "../src/js/demo.js";
const setup = () => {
  const data = seed();
  return {
    data,
    user: data.users[0],
    staff: data.users[1],
    start: addDays(today(), 10),
    end: addDays(today(), 13),
  };
};
test("adjacent checkout/check-in dates do not overlap", () => {
  assert.equal(
    overlap("2026-01-01", "2026-01-04", "2026-01-04", "2026-01-06"),
    false,
  );
  assert.equal(
    overlap("2026-01-01", "2026-01-04", "2026-01-03", "2026-01-06"),
    true,
  );
  assert.equal(nights("2026-01-01", "2026-01-04"), 3);
});
test("invalid, reversed, past, and overly long stays are rejected", () => {
  const { start, end } = setup();
  assert.throws(() => validateDates("", end));
  assert.throws(() => validateDates(end, start));
  assert.throws(() => validateDates(addDays(today(), -1), end));
  assert.throws(() => validateDates(start, addDays(start, 31)));
  assert.throws(() => validateDates("2026-02-30", end));
});
test("a reservation snapshots the price and permits only the owner’s suitable pet", () => {
  const { data, user, start, end } = setup();
  const b = createBooking(data, user, "pet-mochi", "classic", start, end);
  assert.equal(b.total, 1950);
  assert.equal(b.rate, 650);
  assert.equal(b.status, "PENDING");
  assert.throws(() =>
    createBooking(
      data,
      { ...user, id: "other" },
      "pet-mochi",
      "classic",
      start,
      end,
    ),
  );
  assert.throws(() =>
    createBooking(data, user, "pet-miso", "classic", start, end),
  );
  assert.throws(() =>
    createBooking(data, null, "pet-mochi", "classic", start, end),
  );
});
test("two held rooms exhaust capacity and expiry releases a room", () => {
  const { data, user, start, end } = setup();
  data.pets.push(
    { ...data.pets[0], id: "pet-two" },
    { ...data.pets[0], id: "pet-three" },
  );
  const first = createBooking(data, user, "pet-mochi", "classic", start, end);
  createBooking(data, user, "pet-two", "classic", start, end);
  assert.equal(availableRooms(data, "classic", start, end).length, 0);
  assert.throws(() =>
    createBooking(data, user, "pet-three", "classic", start, end),
  );
  first.expiresAt = Date.now() - 1;
  expire(data);
  assert.equal(first.status, "EXPIRED");
  assert.equal(availableRooms(data, "classic", start, end).length, 1);
});
test("one pet cannot have overlapping stays in different rooms", () => {
  const { data, user, start, end } = setup();
  createBooking(data, user, "pet-mochi", "classic", start, end);
  assert.throws(
    () => createBooking(data, user, "pet-mochi", "garden", start, end),
    /already has a stay/,
  );
  assert.doesNotThrow(() =>
    createBooking(data, user, "pet-mochi", "garden", end, addDays(end, 2)),
  );
});
test("failed checkout is retryable and successful checkout is idempotent", () => {
  const { data, user, start, end } = setup();
  const b = createBooking(data, user, "pet-mochi", "classic", start, end);
  payBooking(data, user, b.id, false);
  assert.equal(b.status, "PENDING");
  assert.equal(b.paymentStatus, "FAILED");
  payBooking(data, user, b.id, true);
  const count = b.logs.length;
  payBooking(data, user, b.id, true);
  assert.equal(b.status, "CONFIRMED");
  assert.equal(b.logs.length, count);
});
test("other users and expired holds cannot be paid", () => {
  const { data, user, start, end } = setup();
  const b = createBooking(data, user, "pet-mochi", "classic", start, end);
  assert.throws(() => payBooking(data, { id: "other" }, b.id));
  b.expiresAt = Date.now() - 1;
  assert.throws(() => payBooking(data, user, b.id));
});
test("cancellation needs a reason, ownership and staff review", () => {
  const { data, user, staff } = setup();
  assert.throws(() =>
    requestCancellation(
      data,
      { id: "other" },
      "PW-1042",
      "Travel plans changed.",
    ),
  );
  assert.throws(() => requestCancellation(data, user, "PW-1042", "Short"));
  const b = requestCancellation(
    data,
    user,
    "PW-1042",
    "Our travel plans changed.",
  );
  assert.equal(b.status, "CONFIRMED");
  assert.throws(() =>
    requestCancellation(data, user, b.id, "Our travel plans changed."),
  );
  assert.throws(() => reviewCancellation(data, user, b.id, true, "Approved."));
  reviewCancellation(
    data,
    staff,
    b.id,
    false,
    "Your stay is outside the demo cancellation policy.",
  );
  assert.equal(b.status, "CONFIRMED");
  assert.equal(b.cancellation.status, "DECLINED");
});
test("approved cancellation refunds once and releases its room", () => {
  const { data, user, staff } = setup();
  const b = requestCancellation(
    data,
    user,
    "PW-1042",
    "Our travel plans changed.",
  );
  reviewCancellation(
    data,
    staff,
    b.id,
    true,
    "Approved. See you another time.",
  );
  assert.equal(b.status, "CANCELLED");
  assert.equal(b.refundAmount, b.total);
  assert.equal(b.refundStatus, "SUCCESS");
  assert.throws(() => reviewCancellation(data, staff, b.id, true, "Again."));
  assert.equal(availableRooms(data, "garden", b.start, b.end).length, 2);
});
