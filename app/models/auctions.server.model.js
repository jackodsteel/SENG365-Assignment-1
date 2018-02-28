"use strict";

const db = require("../../config/db");

exports.getAll = function (done) {
    db.get_pool().query("SELECT * FROM auction", function (err, rows) {

        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            return done(rows);
        }
    });
};

exports.getOne = function (auctionId, done) {
    db.get_pool().query("SELECT * FROM auction WHERE auction_id = ?", auctionId, function (err, rows) {

        if (err) {
            done(err);
        } else {
            done(rows);
        }
    });
};

exports.insert = function (values, done) {
    db.get_pool().query("INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_creationdate, auction_startingdate, auction_endingdate, auction_userid) VALUES (?)", [values], function (err, result) {
        if (err) {
            done(err);
        } else {
            done(result);
        }
    });
};

exports.alter = function () {
    return null;
};

exports.remove = function () {
    return null;
};
