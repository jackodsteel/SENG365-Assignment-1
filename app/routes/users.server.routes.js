"use strict";

const users = require("../controllers/users.server.controller");
const auth = require("../controllers/authentication.server.controller");

module.exports = function (app) {
    app.route("/users")
        .post(users.create);

    app.route("/users/login")
        .post(auth.login);

    app.route("/users/logout")
        .post(auth.logout);

    app.route("/users/:userId")
        .get(users.read)
        .patch(users.update);
};