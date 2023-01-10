const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Cool {
  constructor(params) {
    this.result = ServiceProvider.get("valueService").getValue();
    console.log(this.result);
  }
  data() {
    return {
      title: "Cool",
      result: this.result,
    };
  }

  add(a, b) {
    this.result = a + b;
    console.log(this.result);
    ServiceProvider.get("valueService").setValue(this.result);
  }
};
