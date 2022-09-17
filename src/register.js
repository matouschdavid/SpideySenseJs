const RestaurantService = require("./services/restaurant_service");
const RegionService = require("./services/region_service");
const Restaurants = require("./views/restaurants/restaurants");
const Regions = require("./views/regions/regions");
const Home = require("./views/home/home");
const ServiceProvider = require("../framework/service_provider");

module.exports = function () {
  ServiceProvider.register("home", (params) => {
    return new Home(params);
  });
  ServiceProvider.register("regions", (params) => {
    return new Regions(params);
  });
  ServiceProvider.register("restaurants", (params) => {
    return new Restaurants(params);
  });
  ServiceProvider.register("regionService", () => {
    return new RegionService();
  });
  ServiceProvider.register("restaurantService", () => {
    return new RestaurantService();
  });
};