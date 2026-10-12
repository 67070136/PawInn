import { logout } from "../api/account.js";
import {
  money,
  dateLabel,
  today,
  addDays,
  nights,
  typeFor,
} from "../helpers.js";
export default () => ({
  mobileOpen: false,
  profileOpen: false,
  money,
  dateLabel,
  today,
  addDays,
  nights,
  typeFor,
  active(page) {
    return (document.body.dataset.page || "home") === page;
  },
  get initials() {
    return (this.$store.portal.user?.name || "Guest")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  },
  signOut() {
    logout();
    location.href = "/pages/login.html";
  },
  badge(status) {
    return `badge badge-${status.toLowerCase()}`;
  },
  searchStay(event) {
    const form = new FormData(event.target);
    const params = new URLSearchParams(form);
    location.href = `/pages/rooms.html?${params}`;
  },
});
