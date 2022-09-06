const Component = require("./views/component/component"); 
const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  ServiceProvider.register("home", (params) => {
    return new Home(params);
  });
 ServiceProvider.register("component", (params) => {return new Component(params);});
};