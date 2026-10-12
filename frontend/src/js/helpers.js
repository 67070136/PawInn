import {
  ROOM_TYPES,
  money,
  dateLabel,
  today,
  addDays,
  nights,
} from "./demo.js";
export { money, dateLabel, today, addDays, nights };
export const typeFor = (id) => ROOM_TYPES.find((t) => t.id === id);
export function nextPath(fallback = "/pages/bookings.html") {
  const candidate = new URLSearchParams(location.search).get("next");
  if (!candidate) return fallback;
  const url = new URL(candidate, location.origin);
  return url.origin === location.origin &&
    [
      "/",
      "/index.html",
      "/pages/pets.html",
      "/pages/rooms.html",
      "/pages/bookings.html",
      "/pages/checkout.html",
      "/pages/staff-dashboard.html",
    ].includes(url.pathname)
    ? url.pathname + url.search
    : fallback;
}
export function toast(message) {
  window.dispatchEvent(new CustomEvent("pawinn:toast", { detail: message }));
}
export function goToLogin() {
  location.href = `/pages/login.html?next=${encodeURIComponent(location.pathname + location.search)}`;
}
