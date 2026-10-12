// Browser-only adapter. Replace API adapters with server calls when services are ready.
export const STORAGE_KEY = "pawinn.demo.v1";
export const SESSION_KEY = "pawinn.session.v1";
export const ROOM_TYPES = [
  {
    id: "classic",
    name: "The Cozy Den",
    subtitle: "A snug little home away from home.",
    species: "Dog",
    rate: 650,
    size: "4 m²",
    image: "cozy-den.svg",
    tag: "THE EVERYDAY FAVORITE",
    features: ["Soft bedding", "Climate controlled", "Daily playtime"],
  },
  {
    id: "garden",
    name: "The Garden Suite",
    subtitle: "More room for a little adventure.",
    species: "Dog",
    rate: 950,
    size: "8 m²",
    image: "garden-suite.svg",
    tag: "A LITTLE EXTRA ROOM",
    features: ["Private patio", "Spacious bedding", "Daily playtime"],
  },
  {
    id: "cat",
    name: "The Cat Loft",
    subtitle: "For naps, stretches, and window watching.",
    species: "Cat",
    rate: 750,
    size: "5 m²",
    image: "cat-loft.svg",
    tag: "JUST FOR FELINES",
    features: ["Climbing shelves", "Window perch", "Quiet cat-only space"],
  },
];
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function addDays(value, count) {
  const d = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(d.getTime())) return "";
  d.setUTCDate(d.getUTCDate() + count);
  return d.toISOString().slice(0, 10);
}
export function nights(start, end) {
  return Math.round(
    (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
      86400000,
  );
}
export function overlap(a, b, c, d) {
  return a < d && c < b;
}
export function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}
export function dateLabel(value) {
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(d.getTime())
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(d)
    : "Choose a date";
}
export function seed() {
  const base = today();
  return {
    version: 1,
    users: [
      {
        id: "demo-customer",
        name: "Jamie Parker",
        email: "jamie@pawinn.demo",
        role: "CUSTOMER",
      },
      {
        id: "demo-staff",
        name: "PawInn team",
        email: "team@pawinn.demo",
        role: "STAFF",
      },
    ],
    pets: [
      {
        id: "pet-mochi",
        ownerId: "demo-customer",
        name: "Mochi",
        species: "Dog",
        breed: "Golden Retriever",
        birthDate: addDays(base, -730),
        notes: "A gentle soul. Loves tennis balls and a good belly rub.",
        avatar: "dog",
      },
      {
        id: "pet-miso",
        ownerId: "demo-customer",
        name: "Miso",
        species: "Cat",
        breed: "Domestic Shorthair",
        birthDate: addDays(base, -1095),
        notes: "Prefers a quiet corner. Wet food in the evening.",
        avatar: "cat",
      },
    ],
    bookings: [
      {
        id: "PW-1042",
        userId: "demo-customer",
        petId: "pet-mochi",
        petName: "Mochi",
        species: "Dog",
        roomId: "garden-1",
        typeId: "garden",
        start: addDays(base, 4),
        end: addDays(base, 7),
        rate: 950,
        total: 2850,
        status: "CONFIRMED",
        paymentStatus: "SUCCESS",
        createdAt: new Date().toISOString(),
        cancellation: null,
        logs: [
          {
            at: new Date().toISOString(),
            text: "Booking confirmed · demo payment successful",
          },
        ],
      },
      {
        id: "PW-1031",
        userId: "demo-customer",
        petId: "pet-miso",
        petName: "Miso",
        species: "Cat",
        roomId: "cat-1",
        typeId: "cat",
        start: addDays(base, -20),
        end: addDays(base, -17),
        rate: 750,
        total: 2250,
        status: "COMPLETED",
        paymentStatus: "SUCCESS",
        createdAt: new Date().toISOString(),
        cancellation: null,
        logs: [{ at: new Date().toISOString(), text: "Stay completed" }],
      },
    ],
    sequence: 1042,
  };
}
export function validateDates(start, end) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end))
    throw new Error("Choose your check-in and check-out dates.");
  const count = nights(start, end);
  if (
    !Number.isFinite(count) ||
    new Date(`${start}T00:00:00Z`).toISOString().slice(0, 10) !== start ||
    new Date(`${end}T00:00:00Z`).toISOString().slice(0, 10) !== end
  )
    throw new Error("Choose valid calendar dates.");
  if (start < today()) throw new Error("Check-in must be today or later.");
  if (count < 1) throw new Error("Check-out must be after check-in.");
  if (count > 30) throw new Error("Demo stays are limited to 30 nights.");
  return count;
}
export function expire(data, now = Date.now()) {
  for (const b of data.bookings)
    if (b.status === "PENDING" && b.expiresAt <= now) {
      b.status = "EXPIRED";
      b.logs.push({
        at: new Date(now).toISOString(),
        text: "Reservation hold expired",
      });
    }
  return data;
}
export function availableRooms(data, typeId, start, end) {
  return [1, 2]
    .map((n) => `${typeId}-${n}`)
    .filter(
      (id) =>
        !data.bookings.some(
          (b) =>
            b.roomId === id &&
            ["PENDING", "CONFIRMED"].includes(b.status) &&
            !(b.status === "PENDING" && b.expiresAt <= Date.now()) &&
            overlap(start, end, b.start, b.end),
        ),
    );
}
export function createBooking(data, user, petId, typeId, start, end) {
  if (!user || user.role !== "CUSTOMER")
    throw new Error("Sign in as a customer to book a stay.");
  const count = validateDates(start, end),
    pet = data.pets.find((p) => p.id === petId && p.ownerId === user.id),
    type = ROOM_TYPES.find((r) => r.id === typeId);
  if (!pet) throw new Error("Choose one of your pets.");
  if (!type || pet.species !== type.species)
    throw new Error("Choose a room suitable for your pet.");
  expire(data);
  if (
    data.bookings.some(
      (b) =>
        b.petId === petId &&
        ["PENDING", "CONFIRMED"].includes(b.status) &&
        overlap(start, end, b.start, b.end),
    )
  ) {
    throw new Error(
      "This pet already has a stay on those dates. Check your bookings or choose different dates.",
    );
  }
  const roomId = availableRooms(data, typeId, start, end)[0];
  if (!roomId)
    throw new Error(
      "Those dates just filled up. Please choose another room or date.",
    );
  const b = {
    id: `PW-${++data.sequence}`,
    userId: user.id,
    petId,
    petName: pet.name,
    species: pet.species,
    roomId,
    typeId,
    start,
    end,
    rate: type.rate,
    total: type.rate * count,
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + 15 * 60 * 1000,
    cancellation: null,
    logs: [
      {
        at: new Date().toISOString(),
        text: "Room reserved · checkout available for 15 minutes",
      },
    ],
  };
  data.bookings.push(b);
  return b;
}
export function payBooking(data, user, id, success = true) {
  expire(data);
  const b = data.bookings.find((b) => b.id === id && b.userId === user?.id);
  if (!b) throw new Error("Booking not found.");
  if (b.status === "CONFIRMED" && b.paymentStatus === "SUCCESS") return b;
  if (b.status !== "PENDING")
    throw new Error(
      "This booking can no longer be paid. Please reserve a new stay.",
    );
  b.paymentStatus = success ? "SUCCESS" : "FAILED";
  if (success) {
    b.status = "CONFIRMED";
    b.paymentReference = `DEMO-${b.id}`;
    b.paidAt = new Date().toISOString();
  }
  b.logs.push({
    at: new Date().toISOString(),
    text: success
      ? "Booking confirmed · demo payment successful"
      : "Demo payment declined · you can retry",
  });
  return b;
}
export function requestCancellation(data, user, id, reason) {
  const b = data.bookings.find((b) => b.id === id && b.userId === user?.id);
  if (!b || b.status !== "CONFIRMED" || b.start <= today())
    throw new Error(
      "Only upcoming confirmed stays can be submitted for cancellation.",
    );
  if (b.cancellation?.status === "PENDING")
    throw new Error("Your request is already awaiting review.");
  if (reason.trim().length < 10 || reason.trim().length > 1000)
    throw new Error("Please enter a reason between 10 and 1,000 characters.");
  b.cancellation = {
    reason: reason.trim(),
    status: "PENDING",
    requestedAt: new Date().toISOString(),
  };
  b.logs.push({
    at: new Date().toISOString(),
    text: "Cancellation requested · awaiting staff review",
  });
  return b;
}
export function reviewCancellation(data, user, id, approved, note) {
  if (user?.role !== "STAFF") throw new Error("Staff access is required.");
  const b = data.bookings.find((b) => b.id === id);
  if (!b || b.cancellation?.status !== "PENDING")
    throw new Error("This request has already been reviewed.");
  if (!note.trim()) throw new Error("Add a short review note.");
  Object.assign(b.cancellation, {
    status: approved ? "APPROVED" : "DECLINED",
    note: note.trim(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: user.id,
  });
  if (approved) {
    b.status = "CANCELLED";
    b.refundStatus = "SUCCESS";
    b.refundAmount = b.total;
  }
  b.logs.push({
    at: new Date().toISOString(),
    text: approved
      ? "Cancellation approved · full demo refund issued"
      : "Cancellation declined · booking remains confirmed",
  });
  return b;
}
