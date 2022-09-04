const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");
const TestService = require("./services/testService");

module.exports = function () {
  ServiceProvider.register("home", function (params) {
    return new Home(params);
  });
  ServiceProvider.register("testService", () => {
    return new TestService();
  })
};