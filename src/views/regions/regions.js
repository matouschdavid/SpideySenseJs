const fs = require("fs");
module.exports = class Regions {
    constructor(params) {}
    data() {
        return {
            title: "Regions",
            regions: this.getAllRegions(),
            param: "Server Value"
        };
    }

    getAllRegions() {
        return fs.readFileSync('./assets/regions.txt', 'utf-8').split(/\r?\n/);
    }

    addRegion(newRegion) {
        fs.appendFileSync("./assets/regions.txt", `\n${newRegion}`);
    }

    testParams(nr, str, bool, flo, cval, sval) {
        console.log(nr);
        console.log(str);
        console.log(bool);
        console.log(flo);
        console.log(cval);
        console.log(sval);
    }
};