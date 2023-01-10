const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Home {
  constructor(params) {
    this.calculatorService = ServiceProvider.get("calculatorService");
    this.previousResult = this.calculatorService.getCurrentResult();
  }
  data() {
    return {
      title: "Home",
      value1: this.previousResult,
      value2: 0,
    };
  }

  add(a, b) {
    this.calculatorService.add(a, b);
  }

  subtract(a, b) {
    this.calculatorService.subtract(a, b);
  }
};
