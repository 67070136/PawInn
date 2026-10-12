import { login } from "../api/account.js";
import { nextPath } from "../helpers.js";
export default () => ({
  email: "",
  password: "",
  showPassword: false,
  error: "",
  busy: false,
  submit() {
    this.error = "";
    if (this.password.length < 8) {
      this.error =
        "Use any made-up password of at least 8 characters in this demo.";
      return;
    }
    this.signIn(this.email);
  },
  signIn(email) {
    try {
      this.busy = true;
      const user = login(email);
      this.password = "";
      location.href = nextPath(
        user.role === "STAFF"
          ? "/pages/staff-dashboard.html"
          : "/pages/bookings.html",
      );
    } catch (error) {
      this.error = error.message;
      this.busy = false;
    }
  },
});
