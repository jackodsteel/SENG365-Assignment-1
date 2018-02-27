"use strict";

const crypto = require("crypto");
const Auth = require("../models/authentication.server.model");
const constants = require("../../config/constants");

exports.getAuthenticatedUser = function (token) {
    Auth.getIdByToken(token, function (result) {
        return result.user_id;
    });
};

exports.login = function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    Auth.getPassword(username, email, function (result) {
        if (result.user_password === password) {
            let token = crypto.randomBytes(constants.TOKEN_LENGTH * (3 / 4)).toString("base64");
            Auth.setToken(result.user_id, token, function () {
                return res.json({"id": result.user_id, "token": token});
            });
        } else {
            res.status(400).send("Invalid username/email/password supplied");
        }
    });
};

exports.logout = function (req, res) {
    let token = req.get("X-Authorization");
    Auth.revokeToken(token, function (result) {
        if (result.affectedRows === 1) {
            return res.send("OK");
        } else {
            return res.status(401).send("Unauthorized");
        }
    });
};
