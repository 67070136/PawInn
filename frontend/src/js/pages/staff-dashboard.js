import { review, complete } from "../api/bookings.js";
import { today, toast } from "../helpers.js";
export default () => ({
  tab: "requests",
  query: "",
  target: null,
  approved: true,
  note: "",
  error: "",
  get all() {
    return this.$store.portal.user?.role === "STAFF"
      ? this.$store.portal.data.bookings
      : [];
  },
  get requests() {
    return this.all.filter((b) => b.cancellation?.status === "PENDING");
  },
  get items() {
    return (this.tab === "requests" ? this.requests : this.all).filter((b) =>
      `${b.id} ${b.petName} ${this.customer(b.userId)}`
        .toLowerCase()
        .includes(this.query.toLowerCase()),
    );
  },
  get arrivals() {
    return this.all.filter(
      (b) => b.status === "CONFIRMED" && b.start === today(),
    ).length;
  },
  get occupied() {
    return this.all.filter(
      (b) => b.status === "CONFIRMED" && b.start <= today() && b.end > today(),
    ).length;
  },
  customer(id) {
    return (
      this.$store.portal.data.users.find((u) => u.id === id)?.name || "Customer"
    );
  },
  openReview(b, approved) {
    this.target = b;
    this.approved = approved;
    this.note = "";
    this.error = "";
  },
  submitReview() {
    try {
      review(this.target.id, this.approved, this.note);
      this.target = null;
      toast(
        this.approved
          ? "Cancellation approved. Demo refund issued."
          : "Request declined. Booking remains confirmed.",
      );
    } catch (error) {
      this.error = error.message;
    }
  },
  finish(b) {
    try {
      complete(b.id);
      toast("Stay marked completed.");
    } catch (error) {
      toast(error.message);
    }
  },
});
