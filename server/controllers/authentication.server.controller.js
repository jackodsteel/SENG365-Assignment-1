"use strict";

const crypto = require("crypto");
const Auth = require("../models/authentication.server.model");

exports.getAuthenticatedUser = async function (token) {
    return new Promise((resolve, reject) => {
        Auth.getIdByToken(token, function (result) {
            if (typeof result !== "undefined" && "user_id" in result) {
                resolve(result.user_id);
            } else {
                reject("User not authenticated");
            }
        });
    });
};


exports.login = function (req, res) {
    let username = req.query["username"];
    let email = req.query["email"];
    let password = req.query["password"];

    Auth.getPassword(username, email, function (result) {
        if (result && result["user_password"] === password) {
            let token = crypto.randomBytes(24).toString("base64");
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
