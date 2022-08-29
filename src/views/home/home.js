module.exports = class Home {
  constructor(queryParams) {
    console.log(queryParams);
    this.currentNr = queryParams.test;
  }
  data() {
    return { title: "Home", currentNr: this.currentNr };
  }
};
