require("../src/register")();
const http = require("http");
const express = require("express");
const { routes } = require("../src/routing");
const ServiceProvider = require("./service_provider");

const app = express();
app.use(express.urlencoded({ extended: true }));

require("./view_engine").initEngine(app);

//configure all routes
routes.forEach((route) => {
  app.get(route.path, function (req, res) {
    console.log("here");
    res.render(`${route.component}/${route.component}`, req.query);
  });
});

//configure click handler
app.post("/click", function (req, res) {
  const page = req.body.page;
  const params = req.body.params.split(",");
  for (let index = 0; index < params.length; index++) {
    let value = params[index];
    if (value.startsWith("*")) value = value.substring(1);
    params[index] = req.body[value];
  }
  // const pageClass = require(`./views/${page}/${page}`);
  // const pageObj = new pageClass();
  const pageObj = ServiceProvider.instance.createInstance(page);
  Reflect.apply(pageObj[req.body.onclick], pageObj, params);
  res.redirect(req.body.redirect);
});

//start server
const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
