"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = function () {
    const app = express();

    app.use(bodyParser.json());
    app.use("/assets", express.static("../public/assets/"));

    require("../server/routes/auctions.server.routes")(app);
    require("../server/routes/database.server.routes")(app);
    require("../server/routes/photos.server.routes")(app);
    require("../server/routes/users.server.routes")(app);

    return app;
};