import { STORAGE_KEY, SESSION_KEY, seed, expire } from "./demo.js";
let volatileData,
  volatileSession = null;
export function readData() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      value?.version === 1 &&
      Array.isArray(value.users) &&
      Array.isArray(value.pets) &&
      Array.isArray(value.bookings)
    )
      return expire(value);
  } catch {
    /* Recover from missing or damaged browser data. */
  }
  return volatileData || seed();
}
export function saveData(data) {
  volatileData = data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    window.dispatchEvent(new CustomEvent("pawinn:storage-warning"));
  }
  return data;
}
export function session() {
  let id = volatileSession;
  try {
    id = localStorage.getItem(SESSION_KEY);
  } catch {}
  return readData().users.find((u) => u.id === id) || null;
}
export function setSession(id) {
  volatileSession = id;
  try {
    if (id) localStorage.setItem(SESSION_KEY, id);
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}
export function mutate(callback) {
  const data = readData();
  const result = callback(data);
  saveData(data);
  window.dispatchEvent(new Event("pawinn:update"));
  return result;
}
