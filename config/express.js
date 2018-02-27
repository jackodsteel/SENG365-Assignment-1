"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = function () {
    const app = express();

    app.use(bodyParser.json());
    app.use("/assets", express.static("../public/assets/"));

    require("../app/routes/users.server.routes")(app);
    require("../app/routes/auctions.server.routes")(app);

    return app;
};