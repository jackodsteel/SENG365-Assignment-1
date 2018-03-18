"use strict";

const User = require("../models/users.server.model");
const auth = require("./authentication.server.controller");
const validator = require("validator");

exports.create = function (req, res) {

    /* Validate that all fields are not null and that email is valid */
    if (!(req.body["username"] &&
            req.body["givenName"] &&
            req.body["familyName"] &&
            req.body["email"] &&
            req.body["password"] &&
            validator.isEmail(req.body["email"] + ""))) {
        return res.status(400).send("Malformed request");
    }
    let userData = [
        req.body["username"],
        req.body["givenName"],
        req.body["familyName"],
        req.body["email"],
        req.body["password"]
    ];

    User.insert(userData, function (result) {
        console.log(result);
        if (result.insertId) {
            return res.status(201).json({"id": result.insertId});
        } else {
            console.log(result);
            return res.status(400).send("Malformed request");
        }
    });
};

exports.read = function (req, res) {
    if (isNaN(req.params["userId"])) {
        return res.status(404).send("Not found");
    }
    let userId = parseInt(req.params["userId"]);
    let isSelf = false;
    auth.getAuthenticatedUser(req.get("X-Authorization")).then((authenticatedUserId) => {
        isSelf = authenticatedUserId === userId;
    }).catch(() => {
        isSelf = false;
    }).then(() => {
        User.getOne(userId, function (result) {
            if (result["ERROR"]) {
                return res.status(404).send("Not found");
            } else if (isSelf) {
                return res.json(result);
            } else {
                return res.json({
                    "username": result["username"],
                    "givenName": result["givenName"],
                    "familyName": result["familyName"]
                });
            }
        });
    });
};

exports.update = function (req, res) {
    let clauses = [];
    if (isNaN(req.params["userId"]) || req.params["userId"] <= 0) {
        return res.status(400).send("Bad request.")
    }
    let userId = parseInt(req.params["userId"]);
    auth.getAuthenticatedUser(req.get("X-Authorization")).then((currentUser) => {
        if (currentUser !== userId) {
            return res.status(401).send("Unauthorized");
        }

        if (req.body["username"]) {
            clauses.push("user_username='" + req.body["username"] + "'");
        }

        if (req.body["givenName"]) {
            clauses.push("user_givenname='" + req.body["givenName"] + "'");
        }

        if (req.body["familyName"]) {
            clauses.push("user_familyname=" + req.body["familyName"]);
        }

        if (req.body["password"]) {
            clauses.push("user_password=" + req.body["password"]);
        }

        if (req.body["email"] && validator.isEmail(req.body["email"] + "")) {
            clauses.push("user_email='" + req.body["email"] + "'");
        } else if (req.body["email"]) {
            return res.status(400).send("Bad request.");
        }

        let updateString = "";

        if (clauses.length > 0) {
            updateString = "UPDATE auction_user SET " + clauses.join(", ");
        } else {
            return res.status(400).send("Bad request, no valid fields to update.");
        }
        updateString += " WHERE user_id=" + userId;

        User.alter(updateString, function (result) {
            if (result["ERROR"]) {
                console.log(result);
                return res.status(500).send("Internal server error");
            }
            return res.status(201).send("OK");
        });


    }).catch(() => {
        return res.status(401).send("Unauthorized");
    });
};