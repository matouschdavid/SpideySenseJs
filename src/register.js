const Flo = require("./views/flo/flo"); 
const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  ServiceProvider.register("home", (params) => {
    return new Home(params);
  });
 ServiceProvider.register("flo", (params) => {return new Flo(params);});
};