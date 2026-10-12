import { listRooms } from "../api/rooms.js";
import { reserve } from "../api/bookings.js";
import { today, addDays, goToLogin } from "../helpers.js";
export default () => ({
  bookingMode: true,
  start: addDays(today(), 10),
  end: addDays(today(), 13),
  species: "All",
  sort: "recommended",
  query: "",
  results: [],
  error: "",
  checked: false,
  selected: null,
  petId: "",
  reserveError: "",
  busy: false,
  init() {
    const p = new URLSearchParams(location.search);
    this.start = p.get("start") || this.start;
    this.end = p.get("end") || this.end;
    this.species = ["Dog", "Cat"].includes(p.get("species"))
      ? p.get("species")
      : "All";
    this.search();
  },
  search() {
    try {
      this.results = listRooms(this.start, this.end);
      this.error = "";
      this.checked = true;
      const url = new URL(location.href);
      url.searchParams.set("start", this.start);
      url.searchParams.set("end", this.end);
      url.searchParams.set("species", this.species);
      history.replaceState(null, "", url);
    } catch (error) {
      this.error = error.message;
      this.checked = false;
      this.results = [];
    }
  },
  get filtered() {
    let rooms = this.results.filter(
      (r) =>
        (this.species === "All" || r.species === this.species) &&
        `${r.name} ${r.features.join(" ")}`
          .toLowerCase()
          .includes(this.query.toLowerCase()),
    );
    return this.sort === "price"
      ? rooms.sort((a, b) => a.rate - b.rate)
      : rooms;
  },
  get suitablePets() {
    return this.$store.portal.pets.filter(
      (p) => p.species === this.selected?.species,
    );
  },
  choose(room) {
    if (!this.$store.portal.user) {
      goToLogin();
      return;
    }
    if (this.$store.portal.user.role !== "CUSTOMER") {
      this.error = "Use the customer demo account to book a stay.";
      return;
    }
    this.selected = room;
    this.petId = this.suitablePets[0]?.id || "";
    this.reserveError = "";
  },
  book() {
    this.busy = true;
    try {
      const b = reserve(this.petId, this.selected.id, this.start, this.end);
      location.href = `/pages/checkout.html?booking=${encodeURIComponent(b.id)}`;
    } catch (error) {
      this.reserveError = error.message;
      this.busy = false;
      this.search();
    }
  },
});
