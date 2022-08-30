const Home = require("./views/home/home"); 
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  const sp = ServiceProvider.instance;
 sp.register("home", function (params) {return new Home(params);});
};