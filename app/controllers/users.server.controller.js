"use strict";

const User = require("../models/users.server.model");
const validator = require("validator");

exports.create = function (req, res) {
    let username = req.body.username;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let email = req.body.email;
    let password = req.body.password;

    /* Validate that all fields are not null and that email is valid */
    if (username && givenName && familyName && validator.isEmail(email + "") && password) {
        User.insert([username, givenName, familyName, email, password], function (result) {
            console.log(result);
            if (result.insertId) {
                return res.json({"id": result.insertId});
            } else {
                return res.status(400).send("Malformed request");
            }
        });
    } else {
        return res.status(400).send("Malformed request");
    }
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