"use strict";

const database = require("../controllers/database.server.controller");

module.exports = function (app) {
    app.route("/reset")
        .post(database.list);

    app.route("/resample")
        .post(database.list);
};