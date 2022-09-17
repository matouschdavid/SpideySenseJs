const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Regions {
    constructor(params) {
        this.regionService = ServiceProvider.create("regionService");
    }
    data() {
        return {
            title: "Regions",
            regions: this.regionService.getRegions()
        };
    }
};