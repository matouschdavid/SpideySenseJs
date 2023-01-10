const ValueService = require("./services/value_service");
const Cool = require("./views/cool/cool");
const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  ServiceProvider.addTransient("home", (params) => {
    return new Home(params);
  });
  ServiceProvider.addTransient("cool", (params) => {
    return new Cool(params);
  });
  ServiceProvider.addSingleton("valueService", () => {
    return new ValueService();
  });
};
