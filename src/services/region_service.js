module.exports = class RegionService {
    getRegions() {
        return [{
                id: 1,
                name: 'Linz'
            },
            {
                id: 2,
                name: 'Wien'
            },
            {
                id: 3,
                name: 'Riga'
            },
        ];
    }

    getRegionById(regionId) {
        switch (regionId) {
            case "1":
                return 'Linz';
            case "2":
                return "Wien";
            case "3":
                return "Riga";
            default:
                return "No Region given";
        }
    }
}