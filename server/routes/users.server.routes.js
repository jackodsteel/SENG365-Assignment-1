"use strict";

const users = require("../controllers/users.server.controller");
const auth = require("../controllers/authentication.server.controller");

module.exports = function (app) {
    app.route("/api/v1/users")
        .post(users.create);

    app.route("/api/v1/users/login")
        .post(auth.login);

    app.route("/api/v1/users/logout")
        .post(auth.logout);

    app.route("/api/v1/users/:userId")
        .get(users.read)
        .patch(users.update);
};