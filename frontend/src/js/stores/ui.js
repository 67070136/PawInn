export default () => ({
  message: "",
  timer: null,
  notify(message) {
    this.message = message;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.message = "";
    }, 5000);
  },
});
