const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Home {
    constructor(params) {
        this.testService = ServiceProvider.create("testService");
    }
    data() {
        return {
            title: "Home",
            regions: [{
                    id: 1,
                    name: "Linz"
                },
                {
                    id: 2,
                    name: "Wien"
                },
                {
                    id: 3,
                    name: "Riga"
                }
            ],
            objTest: this.testService.getTest(),
            simpleArray: [
                'hihi',
                'haha',
                'hehe'
            ]
        };
    }
};