const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Restaurants {
    constructor(params) {
        this.regionService = ServiceProvider.create("regionService");
        this.restaurantService = ServiceProvider.create("restaurantService");
        this.regionId = params.regionId;
    }
    data() {
        return {
            title: this.regionService.getRegionById(this.regionId),
            restaurants: this.restaurantService.getRestaurantsOfRegion(this.regionId)
        };
    }
};