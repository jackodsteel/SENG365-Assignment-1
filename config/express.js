"use strict";

const express = require("express");
const bodyParser = require("body-parser");

module.exports = function () {
    const app = express();

    app.use(bodyParser.json());
    app.use(function (err, req, res, next) {
        if (err instanceof SyntaxError &&
            err.status >= 400 && err.status < 500 &&
            err.message.indexOf('JSON')) {
            res.status(400).send("Invalid JSON")
        } else {
            next();
        }
    });
    app.use("/assets", express.static("../public/assets/"));

    require("../server/routes/auctions.server.routes")(app);
    require("../server/routes/database.server.routes")(app);
    require("../server/routes/users.server.routes")(app);

    return app;
};