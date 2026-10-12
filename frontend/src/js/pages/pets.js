import { savePet, deletePet } from "../api/account.js";
import { toast } from "../helpers.js";
const blank = () => ({
  id: "",
  name: "",
  species: "Dog",
  breed: "",
  birthDate: "",
  notes: "",
});
export default () => ({
  editing: false,
  deleting: null,
  form: blank(),
  error: "",
  removeError: "",
  filter: "All",
  get pets() {
    return this.$store.portal.pets.filter(
      (p) => this.filter === "All" || p.species === this.filter,
    );
  },
  open(pet) {
    this.form = pet ? { ...pet } : blank();
    this.error = "";
    this.editing = true;
  },
  save() {
    try {
      savePet(this.form);
      this.editing = false;
      toast("Pet profile saved. A little more like home.");
    } catch (error) {
      this.error = error.message;
    }
  },
  remove() {
    try {
      deletePet(this.deleting.id);
      this.deleting = null;
      toast("Pet profile removed. Booking history is preserved.");
    } catch (error) {
      this.removeError = error.message;
    }
  },
  age(birthDate) {
    if (!birthDate) return "Age not added";
    const birth = new Date(birthDate + "T00:00:00"),
      now = new Date();
    let months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      now.getMonth() -
      birth.getMonth() -
      (now.getDate() < birth.getDate() ? 1 : 0);
    months = Math.max(0, months);
    const years = Math.floor(months / 12);
    return months < 12
      ? `${months} ${months === 1 ? "month" : "months"} old`
      : `${years} ${years === 1 ? "year" : "years"} old`;
  },
});
