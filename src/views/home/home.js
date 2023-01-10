const ServiceProvider = require("../../../framework/service_provider");
module.exports = class Home {
  constructor(params) {}
  data() {
    return {
      title: "Home",
      complex: {
        first: "Hihi",
        second: {
          first: "Hehe",
          second: "Hoho"
        }
      },
      regions: [{
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
        }
      ],
      shouldDisplay: true
    };
  }

  test(first, second, third, fourth) {
    console.log(first);
    console.log(second);
    console.log(third);
    console.log(fourth);
  }
};