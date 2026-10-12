import {
  createBooking,
  payBooking,
  requestCancellation,
  reviewCancellation,
  today,
} from "../demo.js";
import { mutate, session } from "../storage.js";
export const reserve = (...args) =>
  mutate((data) => createBooking(data, session(), ...args));
export const pay = (id, success) =>
  mutate((data) => payBooking(data, session(), id, success));
export const cancel = (id, reason) =>
  mutate((data) => requestCancellation(data, session(), id, reason));
export const review = (id, approved, note) =>
  mutate((data) => reviewCancellation(data, session(), id, approved, note));
export function complete(id) {
  return mutate((data) => {
    if (session()?.role !== "STAFF")
      throw new Error("Staff access is required.");
    const b = data.bookings.find((b) => b.id === id);
    if (!b || b.status !== "CONFIRMED" || b.end > today())
      throw new Error(
        "Only confirmed stays whose check-out date has arrived can be completed.",
      );
    b.status = "COMPLETED";
    b.logs.push({
      at: new Date().toISOString(),
      text: "Stay marked completed by staff",
    });
  });
}
