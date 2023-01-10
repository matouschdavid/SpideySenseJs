const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Flo {
  constructor(params) {
    console.log(params);
  }
  data() {
    return { title: "Flo", numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
  }

  addRegion(city) {
    console.log(city);
  }
};
