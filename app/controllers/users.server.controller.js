"use strict";

const User = require("../models/users.server.model");
const validator = require("validator");

exports.create = function (req, res) {

    /* Validate that all fields are not null and that email is valid */
    if (!(req.body.username &&
            req.body.givenName &&
            req.body.familyName &&
            req.body.email &&
            req.body.password &&
            validator.isEmail(req.body.email + ""))) {
        return res.status(400).send("Malformed auction data");
    }
    let userData = [
        req.body.username,
        req.body.givenName,
        req.body.familyName,
        req.body.email,
        req.body.password
    ];

    User.insert(userData, function (result) {
        console.log(result);
        if (result.insertId) {
            return res.json({"id": result.insertId});
        } else {
            return res.status(400).send("Malformed request");
        }
    });
};

exports.login = function (req, res) {
    return null;
};
exports.logout = function (req, res) {
    return null;
};

exports.read = function (req, res) {
    let userId = req.params.userId;
    User.getOne(userId, function (result) {
        res.json(result);
    });
};

exports.update = function (req, res) {
    return null;
};