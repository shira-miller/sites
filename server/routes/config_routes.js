const siteR = require("./sites");
const userR = require("./users");
const countryR = require("./countries");
exports.routesInit = (app) => {
    app.use("/sites", siteR);
    app.use("/users", userR);
    app.use("/countries", countryR);
}