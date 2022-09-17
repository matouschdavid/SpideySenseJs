module.exports.routes = [{
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: "home",
  }, , {
    path: '/regions',
    component: 'regions'
  }, {
    path: '/restaurants',
    component: 'restaurants'
  }
];