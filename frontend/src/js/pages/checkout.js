import { pay } from "../api/bookings.js";
export default () => ({
  id: "",
  result: "success",
  accepted: false,
  error: "",
  busy: false,
  seconds: 0,
  timer: null,
  init() {
    this.id = new URLSearchParams(location.search).get("booking") || "";
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  },
  destroy() {
    clearInterval(this.timer);
  },
  tick() {
    this.seconds = Math.max(
      0,
      Math.ceil(((this.booking?.expiresAt || 0) - Date.now()) / 1000),
    );
    if (this.booking?.status === "PENDING" && !this.seconds)
      this.$store.portal.refresh();
  },
  get booking() {
    return this.$store.portal.bookings.find((b) => b.id === this.id);
  },
  get countdown() {
    return `${Math.floor(this.seconds / 60)}:${String(this.seconds % 60).padStart(2, "0")}`;
  },
  async submit() {
    this.error = "";
    if (!this.accepted) {
      this.error = "Please acknowledge that this is a simulated payment.";
      return;
    }
    this.busy = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const b = pay(this.id, this.result === "success");
      if (b.paymentStatus === "FAILED")
        this.error =
          "Demo payment declined. Your room is still held—select success to retry.";
    } catch (error) {
      this.error = error.message;
    } finally {
      this.busy = false;
    }
  },
});
