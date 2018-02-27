"use strict";

const db = require("../../config/db");

exports.getToken = function (userId, done) {
    db.get_pool().query("SELECT user_token FROM auction_user WHERE user_id = ?", userId, function (err, rows) {
        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            done(rows);
        }
    });
};

exports.setToken = function (userId, token, done) {
    db.get_pool().query("UPDATE auction_user SET user_token = ? WHERE user_id = ?", [token, userId], function (err, rows) {
        if (err) {
            done({"ERROR": "Error updating"});
        } else {
            done(rows);
        }
    });
};

exports.revokeToken = function (token, done) {
    db.get_pool().query("UPDATE auction_user SET user_token = NULL WHERE user_token = ?", token, function (err, rows) {
        if (err) {
            done({"ERROR": "Error updating"});
        } else {
            done(rows);
        }
    });
};

exports.getPassword = function (username, email, done) {
    db.get_pool().query("SELECT user_id, user_password FROM auction_user WHERE (? IS NULL OR user_username = ?) AND (? IS NULL OR user_email = ?)", [username, username, email, email], function (err, rows) {
        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            done(rows[0]);
        }
    });
};

exports.getIdByToken = function (token, done) {
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = ?", token, function (err, rows) {
        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            done(rows[0]);
        }
    });
};