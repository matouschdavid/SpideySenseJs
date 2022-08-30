module.exports = class Restaurants {
    constructor(params) {
        this.region = params.region;
    }
    data() {
        return {
            title: this.region
        };
    }
};