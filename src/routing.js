module.exports.routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: "home",
  },
  ,
  { path: "/flo", component: "flo" },
  { path: "/cool", component: "cool" },
];
