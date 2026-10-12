import { cancel } from "../api/bookings.js";
import { today, toast } from "../helpers.js";
export default () => ({
  tab: "upcoming",
  query: "",
  detail: null,
  cancelTarget: null,
  reason: "",
  error: "",
  init() {
    if (new URLSearchParams(location.search).get("tab") === "history")
      this.tab = "history";
  },
  get items() {
    return this.$store.portal.bookings
      .filter((b) => {
        const active = ["PENDING", "CONFIRMED"].includes(b.status);
        return (
          (this.tab === "all" ||
            (this.tab === "upcoming" && active) ||
            (this.tab === "history" && !active) ||
            (this.tab === "requests" && b.cancellation)) &&
          `${b.id} ${b.petName}`
            .toLowerCase()
            .includes(this.query.toLowerCase())
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  canCancel(b) {
    return (
      b.status === "CONFIRMED" &&
      b.start > today() &&
      b.cancellation?.status !== "PENDING"
    );
  },
  openCancel(b) {
    this.detail = null;
    this.cancelTarget = b;
    this.reason = "";
    this.error = "";
  },
  submitCancel() {
    try {
      cancel(this.cancelTarget.id, this.reason);
      this.cancelTarget = null;
      toast("Cancellation request sent for staff review.");
    } catch (error) {
      this.error = error.message;
    }
  },
});
