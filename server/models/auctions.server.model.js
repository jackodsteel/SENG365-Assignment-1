"use strict";

const db = require("../../config/db");



exports.getAll = function (done) {
    db.get_pool().query("SELECT * FROM auction_view", function (err, rows) {

        if (err) {
            done({"ERROR": "Error selecting"});
        } else {
            return done(rows);
        }
    });
};

exports.getOne = function (auctionId, done) {

    let baseInfo = new Promise (function (resolve, reject) {
        db.get_pool().query("SELECT categoryId, categoryTitle, title, reservePrice, startDateTime, endDateTime, creationDateTime, description, currentBid FROM single_auction_view WHERE auctionId = ?", auctionId, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    let photoInfo = new Promise (function (resolve, reject) {
        db.get_pool().query("SELECT photo_image_URI FROM photo WHERE photo_auctionid = ?", auctionId, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    let sellerInfo = new Promise (function (resolve, reject) {
        db.get_pool().query("SELECT id, username FROM auction_seller_info WHERE auctionId = ?", auctionId, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    let bidInfo = new Promise (function (resolve, reject) {
        db.get_pool().query("SELECT amount, datetime, buyerId, buyerUsername FROM single_auction_bids_view WHERE auctionId = ?", auctionId, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

    Promise.all([baseInfo, photoInfo, sellerInfo, bidInfo]).then(function (values) {
        //Format the JSON
        let jsonObj = values[0][0];
        jsonObj["photoUris"] = values[1];
        jsonObj["seller"] = values[2][0];
        jsonObj["bids"] = values[3];
        done(jsonObj);
    }).catch(function (values) {
        console.log(values);
        done({"ERROR" : values});
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

exports.getBids = function (auctionId, done) {
    db.get_pool().query("SELECT amount, datetime, buyerId, buyerUsername FROM single_auction_bids_view WHERE auctionId = ?", auctionId, function (err, rows) {
        if (err) {
            done({"ERROR" : err});
        } else {
            done(rows[0]);
        }
    });
};

exports.getUserIdByAuctionId = function (auctionId, done) {
    db.get_pool().query("SELECT auction_userid FROM auction WHERE auctionId = ?", auctionId, function (err, rows) {
        if (err) {
            done({"ERROR" : err});
        } else {
            done(rows);
        }
    });
};

exports.alter = function (column, value, auctionId, done) {
    db.get_pool().query("UPDATE auction SET ?=? WHERE auctionId = ?", column, value, auctionId, function (err, rows) {
        if (err) {
            done({"ERROR" : err});
        } else {
            done(rows);
        }
    });
};

exports.remove = function () {
    return null;
};
