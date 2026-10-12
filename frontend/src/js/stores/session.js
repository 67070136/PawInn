import { readData, session, saveData } from "../storage.js";
export default () => ({
  data: saveData(readData()),
  user: session(),
  refresh() {
    this.data = readData();
    this.user = session();
  },
  get pets() {
    return this.data.pets.filter((p) => p.ownerId === this.user?.id);
  },
  get bookings() {
    return this.data.bookings.filter((b) => b.userId === this.user?.id);
  },
});
