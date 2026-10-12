import { register } from "../api/account.js";
import { nextPath } from "../helpers.js";
export default () => ({
  name: "",
  email: "",
  password: "",
  confirm: "",
  accepted: false,
  showPassword: false,
  error: "",
  busy: false,
  submit() {
    this.error = "";
    if (this.password.length < 8) {
      this.error = "Choose a made-up password with at least 8 characters.";
      return;
    }
    if (this.password !== this.confirm) {
      this.error = "Your passwords do not match.";
      return;
    }
    if (!this.accepted) {
      this.error = "Confirm that you understand this is a browser-only demo.";
      return;
    }
    try {
      this.busy = true;
      register(this);
      this.password = "";
      this.confirm = "";
      location.href = nextPath("/pages/pets.html");
    } catch (error) {
      this.error = error.message;
      this.busy = false;
    }
  },
});
