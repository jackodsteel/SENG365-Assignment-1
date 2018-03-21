"use strict";

const db = require("../../config/db");



exports.getAll = function (searchString, done) {
    let sql = "SELECT auctionId AS id, categoryTitle, categoryId, title, reservePrice, startDateTime, endDateTime, currentBid FROM auction_view";
    sql += searchString;
    console.log(sql);
    db.get_pool().query(sql, function (err, rows) {
        if (err) {
            done({"ERROR": err});
        } else {
            return done(rows);
        }
    });
};

exports.getOne = function (auctionId, done) {

    let baseInfo = new Promise (function (resolve, reject) {
        db.get_pool().query("SELECT categoryId, categoryTitle, title, reservePrice, startDateTime, endDateTime, creationDateTime, description, currentBid FROM auction_view WHERE auctionId = ?", auctionId, function (err, rows) {
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

    Promise.all([baseInfo, sellerInfo, bidInfo]).then(function (values) {
        //Format the JSON
        let jsonObj = values[0][0];
        jsonObj["seller"] = values[1][0];
        jsonObj["bids"] = values[2];
        done(jsonObj);
    }).catch(function (values) {
        done({"ERROR" : values});
    });
};

exports.insert = function (values, done) {
    db.get_pool().query("INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_creationdate, auction_startingdate, auction_endingdate, auction_userid) VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?)", values, function (err, result) {
        if (err) {
            done({"ERROR" : err});
        } else {
            done(result);
        }
    });
};

exports.getBids = function (auctionId, done) {
    db.get_pool().query("SELECT amount, datetime, buyerId, buyerUsername FROM single_auction_bids_view WHERE auctionId = ?", auctionId, function (err, rows) {
        if (err) {
            return done({"ERROR" : err});
        } else if (rows["length"] === 0) {
            db.get_pool().query("SELECT 1 FROM auction WHERE auction_id = ? ORDER BY auction_id LIMIT 1", auctionId, function (newerr, newrows) {
                if (newerr || !newrows["length"] > 0) {
                    done({"ERROR" : "404"});
                } else {
                    return done(rows);
                }
            })
        } else {
            return done(rows);
        }
    });
};

exports.getSellerAndTimes = function (auctionId, done) {
    db.get_pool().query("SELECT sellerId, startDateTime, endDateTime, creationDateTime FROM auction_view WHERE auctionId = ?", auctionId, function (err, rows) {
        if (rows && rows["length"] === 1) {
            done(rows[0]);
        } else if (err) {
            done({"ERROR" : err});
        } else {
            done({"ERROR" : "404"});
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

exports.remove = function () {
    return null;
};

exports.addBid = function (values, done) {
    db.get_pool().query("INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) VALUES (?)", [values], function (err, result) {
        if (err) {
            done(err);
        } else {
            done(result);
        }
    });
};

exports.getMaxBidAndTimesAndSeller = function (auctionId, done) {
    db.get_pool().query("SELECT currentBid, startDateTime, endDateTime, sellerId FROM auction_view WHERE auctionId = ?", auctionId, function (err, result) {
        if (err || result["length"] !== 1) {
            done({"ERROR" : err});
        } else {
            done(result[0]);
        }
    });
};