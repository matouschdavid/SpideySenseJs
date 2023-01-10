const CalculatorService = require("./services/calculator_service");
const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  ServiceProvider.addScoped("home", (params) => {
    return new Home(params);
  });
  ServiceProvider.addSessionScoped("calculatorService", () => {
    return new CalculatorService();
  });
};
