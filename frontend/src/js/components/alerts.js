export function installAlerts(Alpine) {
  window.addEventListener("pawinn:toast", (event) =>
    Alpine.store("ui").notify(event.detail),
  );
  window.addEventListener("pawinn:storage-warning", () =>
    Alpine.store("ui").notify(
      "Browser storage is unavailable. Changes will last only for this page session.",
    ),
  );
}
