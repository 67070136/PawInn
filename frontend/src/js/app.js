import Alpine from "alpinejs";
import focus from "@alpinejs/focus";
import portal from "./stores/session.js";
import ui from "./stores/ui.js";
import shell from "./components/navigation.js";
import { installAlerts } from "./components/alerts.js";
import login from "./pages/login.js";
import register from "./pages/register.js";
import pets from "./pages/pets.js";
import rooms from "./pages/rooms.js";
import bookings from "./pages/bookings.js";
import checkout from "./pages/checkout.js";
import staff from "./pages/staff-dashboard.js";
Alpine.plugin(focus);
Alpine.store("portal", portal());
Alpine.store("ui", ui());
for (const [name, component] of Object.entries({
  shell,
  login,
  register,
  pets,
  rooms,
  bookings,
  checkout,
  staff,
}))
  Alpine.data(name, component);
installAlerts(Alpine);
window.addEventListener("pawinn:update", () =>
  Alpine.store("portal").refresh(),
);
window.addEventListener("storage", () => Alpine.store("portal").refresh());
setInterval(() => Alpine.store("portal").refresh(), 15000);
window.Alpine = Alpine;
Alpine.start();
