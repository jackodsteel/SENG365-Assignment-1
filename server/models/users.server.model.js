"use strict";

const db = require("../../config/db");

exports.getAll = function (done) {
    db.get_pool().query("SELECT * FROM auction_user", function (err, rows) {

        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            done(rows);
        }
    });
};

exports.getOne = function (userId, done) {
    db.get_pool().query("SELECT user_username AS 'username', user_givenname AS 'givenName', user_familyname AS 'familyName', user_email AS 'email', user_accountbalance AS 'accountBalance' FROM auction_user WHERE user_id = ?", userId, function (err, rows) {
        if (rows && rows["length"] === 1) {
            done(rows[0]);
        } else {
            done({"ERROR": "Error selecting"});
        }
    });
};

exports.insert = function (values, done) {
    db.get_pool().query("INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES (?)", [values], function (err, result) {
        if (err) {
            done(err);
        } else {
            done(result);
        }
    });
};

exports.alter = function (sql, done) {
    db.get_pool().query(sql, function (err, rows) {
        if (err) {
            done({"ERROR" : err});
        } else {
            done(rows);
        }
    });
};