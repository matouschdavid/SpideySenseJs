require("../src/register")();
const http = require("http");
const path = require("path");
const express = require("express");
const { routes } = require("../src/routing");
const ServiceProvider = require("./service_provider");

const app = express();
require("./view_engine").initEngine(app);
if (routes.filter((route) => route.path == "/").length == 1) {
  app.get("/", (req, res, next) => {
    res.redirect(routes.filter((route) => route.path == "/")[0].redirect);
  });
}
app.use(express.static("./"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.all(/[^}]+/, (req, res, next) => {
  // res.sendFile(path.join(__dirname, 'styles.css'));
  ServiceProvider.clearScoped();
  next();
});

//configure all routes
routes.forEach((route) => {
  app.get(route.path, function (req, res) {
    res.render(`${route.component}/${route.component}`, {
      ...req.query,
      ...req.body,
    });
  });
  app.post(route.path, (req, res) => {
    const params = req.body.params.split(",");
    for (let index = 0; index < params.length; index++) {
      let value = params[index];
      if (value.startsWith("*")) value = value.substring(1);
      params[index] = req.body[value];
    }
    const page = req.url.substring(1);
    const pageObj = ServiceProvider.createPage(page, {
      ...req.query,
      ...req.body,
    });
    delete pageObj.onclick;
    delete pageObj.params;
    Reflect.apply(pageObj[req.body.onclick], pageObj, params);
    res.redirect(req.url);
  });
});

//start server
const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
