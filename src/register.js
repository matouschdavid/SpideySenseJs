const Test = require("./views/test/test");
const Restaurants = require("./views/restaurants/restaurants");
const Regions = require("./views/regions/regions");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  const sp = ServiceProvider.instance;
  sp.register("regions", function (params) {
    return new Regions(params);
  });
  sp.register("restaurants", function (params) {
    return new Restaurants(params);
  });
};