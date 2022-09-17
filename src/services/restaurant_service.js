module.exports = class RestaurantService {
    getRestaurantsOfRegion(regionId) {
        if (regionId == 1) {
            return [{
                id: 1,
                name: 'muto Restaurant',
                rating: 3.5
            }, {
                id: 2,
                name: 'Gelbes Krokodil',
                rating: 4.2
            }];
        } else {
            return [{
                id: -1,
                name: 'No restaurants in this area',
                rating: NaN
            }];
        }
    }
}