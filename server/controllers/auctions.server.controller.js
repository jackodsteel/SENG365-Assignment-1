"use strict";

const Auction = require("../models/auctions.server.model");
const auth = require("./authentication.server.controller");
const fs = require("fs");

exports.list = function (req, res) {
    let clauses = [];
    let offset = 0;
    let limit = 999999;

    if (!isNaN(req.query["startIndex"])) {
        offset = req.query["startIndex"];
    } else if (req.query["startIndex"]) {
        return res.status(400).send("Bad request.");
    }

    if (!isNaN(req.query["count"])) {
        limit = req.query["count"];
    } else if (req.query["count"]) {
        return res.status(400).send("Bad request.");
    }

    if (req.query["q"]) {
        clauses.push("title LIKE '%" + req.query["q"] + "%'");
    }

    if (!isNaN(req.query["category-id"])) {
        clauses.push("categoryId=" + req.query["category-id"]);
    } else if (req.query["category-id"]) {
        return res.status(400).send("Bad request.");
    }

    if (!isNaN(req.query["seller"])) {
        clauses.push("sellerId=" + req.query["seller"]);
    } else if (req.query["seller"]) {
        return res.status(400).send("Bad request.");
    }

    if (!isNaN(req.query["bidder"])) {
        clauses.push("auctionId IN (SELECT bid_auctionid FROM bid WHERE bid_userid=" + req.query["bidder"] + ")");
    } else if (req.query["bidder"]) {
        return res.status(400).send("Bad request.");
    }

    if (!isNaN(req.query["winner"])) {
        clauses.push("bidder=" + req.query["winner"] + " AND endDateTime < CURDATE() AND currentBid >= reservePrice");
    } else if (req.query["winner"]) {
        return res.status(400).send("Bad request.");
    }

    let searchString = "";

    if (clauses.length > 0) {
        searchString = " WHERE " + clauses.join(" AND ");
    }
    searchString += " LIMIT " + limit + " OFFSET " + offset;

    Auction.getAll(searchString, function (result) {
        if (result["ERROR"]) {
            console.log(result);
            return res.status(500).send("Internal server error");
        }
        return res.json(result);
    });
};

exports.create = function (req, res) {

    /* Validity checks */
    let checkFailed = false;
    [req.body["categoryId"], req.body["startDateTime"], req.body["endDateTime"], req.body["reservePrice"], req.body["startingBid"]].forEach(function (field) {
        if (isNaN(field) || field < 0) {
            checkFailed = true;
        }
    });
    if (checkFailed) {
        return res.status(400).send("Malformed auction data");
    }
    if (!(req.body["title"] && req.body["description"])) {
        return res.status(400).send("Malformed auction data");
    }

    let created = Math.floor(new Date() / 1000);
    let startDateTime = Math.floor(req.body["startDateTime"] / 1000);
    let endDateTime = Math.floor(req.body["endDateTime"] / 1000);

    auth.getAuthenticatedUser(req.get("X-Authorization")).then((id) => {
        let userData = [
            req.body["title"],
            req.body["categoryId"],
            req.body["description"],
            req.body["reservePrice"],
            req.body["startingBid"],
            created,
            startDateTime,
            endDateTime,
            id
        ];
        Auction.insert(userData, function (result) {
            if (result.insertId) {
                return res.json({"id": result.insertId});
            } else {
                return res.status(400).send("Malformed request");
            }
        });
    }).catch(() => {
        return res.status(401).send("Unauthorized");
    });
};

exports.view = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId) || auctionId <= 0) {
        return res.status(400).send("Bad request.")
    }
    Auction.getOne(auctionId, function (result) {
        if (result["ERROR"]) {
            console.log(result);
            return res.status(404).send("Not found");
        } else {
            return res.json(result);
        }
    });
};

exports.update = function (req, res) {
    let auctionId = req.params["auctionId"];
    let clauses = [];
    if (isNaN(auctionId) || auctionId <= 0) {
        return res.status(400).send("Bad request.")
    }
    Auction.getCurrentBidAndSeller(auctionId, function (result) {
        if (result["ERROR"] && result["ERROR"] === "404") {
            return res.status(404).send("Not found.")
        }
        if (result["currentBid"]) {
            return res.status(403).send("Forbidden - bidding has begun on the auction.");
        }
        if (result["ERROR"]) {
            console.log(result);
            return res.status(500).send("Internal server error");
        }

        auth.getAuthenticatedUser(req.get("X-Authorization")).then((currentUser) => {
            if (currentUser !== result["sellerId"]) {
                return res.status(401).send("Unauthorized");
            }

            if (req.body["title"]) {
                clauses.push("auction_title='" + req.body["title"] + "'");
            }

            if (req.body["description"]) {
                clauses.push("auction_description='" + req.body["description"] + "'");
            }

            if (!isNaN(req.body["categoryId"]) && req.body["categoryId"] > 0) {
                clauses.push("auction_categoryid=" + req.body["categoryId"]);
            } else if (req.body["categoryId"]) {
                return res.status(400).send("Bad request.");
            }

            if (!isNaN(req.body["startDateTime"]) && req.body["startDateTime"] > 0) {
                let startDateTime = Math.floor(req.body["startDateTime"] / 1000);
                clauses.push("auction_startingdate=FROM_UNIXTIME(" + startDateTime + ")");
            } else if (req.body["startDateTime"]) {
                return res.status(400).send("Bad request.");
            }

            if (!isNaN(req.body["endDateTime"]) && req.body["endDateTime"] > 0) {
                let endDateTime = Math.floor(req.body["endDateTime"] / 1000);
                clauses.push("auction_endingdate=FROM_UNIXTIME(" + endDateTime + ")");
            } else if (req.body["endDateTime"]) {
                return res.status(400).send("Bad request.");
            }

            if (!isNaN(req.body["reservePrice"]) && req.body["reservePrice"] > 0) {
                clauses.push("auction_reserveprice=" + req.body["reservePrice"]);
            } else if (req.body["reservePrice"]) {
                return res.status(400).send("Bad request.");
            }

            if (!isNaN(req.body["startingBid"]) && req.body["startingBid"]) {
                clauses.push("auction_startingprice=" + req.body["startingBid"]);
            } else if (req.body["categoryId"]) {
                return res.status(400).send("Bad request.");
            }

            let updateString = "";

            if (clauses.length > 0) {
                updateString = "UPDATE auction SET " + clauses.join(", ");
            } else {
                return res.status(400).send("Bad request, no valid fields to update.");
            }
            updateString += " WHERE auction_id=" + auctionId;

            Auction.alter(updateString, function (result) {
                if (result["ERROR"]) {
                    console.log(result);
                    return res.status(500).send("Internal server error");
                }
                return res.status(201).send("OK");
            });


        }).catch(() => {
            return res.status(401).send("Unauthorized");
        });
    });
};

exports.viewBids = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId)) {
        return res.status(400).send("Bad request.")
    }
    Auction.getBids(auctionId, function (result) {
        if (!result || result["ERROR"]) {
            return res.status(404).send("Not found");
        } else {
            return res.json(result);
        }
    });
};

exports.makeBid = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId)) {
        return res.status(400).send("Bad request.")
    }
    let amount = req.query["amount"];
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).send("Bad request.")
    }

    let created = new Date().toISOString().slice(0, 19).replace('T', ' ');

    Auction.getMaxBid(auctionId, function (result) {
        if (result["currentBid"] !== null && result["currentBid"] >= amount) {
            return res.status(400).send("Bad request.")
        }

        auth.getAuthenticatedUser(req.get("X-Authorization")).then((userId) => {
            let bidData = [
                userId,
                auctionId,
                amount,
                created
            ];
            Auction.addBid(bidData, function (result) {
                if (result.insertId) {
                    return res.status(201).send("OK");
                } else if (result["code"] && result["code"] === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(404).send("Not found");
                }
                else {
                    return res.status(400).send("Bad request.");
                }
            });
        }).catch(() => {
            return res.status(401).send("Unauthorized");
        });
    });
};

exports.getPhoto = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId) || auctionId <= 0) {
        return res.status(404).send("Not found");
    }
    if (fs.existsSync("./public/assets/images/" + auctionId)) {
        let stream = fs.createReadStream(("./public/assets/images/" + auctionId));
        stream.pipe(res);
    } else {
        let defaultStream = fs.createReadStream(("./public/assets/images/default"));
        defaultStream.pipe(res);
    }
};

exports.addPhoto = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId) || auctionId <= 0) {
        return res.status(404).send("Not found");
    }
    Auction.getCurrentBidAndSeller(auctionId, function (result) {
        if (result["ERROR"] && result["ERROR"] === "404") {
            return res.status(404).send("Not found.")
        }
        if (result["ERROR"]) {
            console.log(result);
            return res.status(500).send("Internal server error");
        }

        auth.getAuthenticatedUser(req.get("X-Authorization")).then((currentUser) => {
            if (currentUser !== result["sellerId"]) {
                return res.status(401).send("Unauthorized");
            }
            req.pipe(fs.createWriteStream("./public/assets/images/" + auctionId));
            return res.status(201).send("OK");

        }).catch((err) => {
            return res.status(401).send("Unauthorized");
        });
    });
};

exports.deletePhoto = function (req, res) {
    let auctionId = req.params["auctionId"];
    if (isNaN(auctionId) || auctionId <= 0) {
        return res.status(404).send("Not found");
    }
    Auction.getCurrentBidAndSeller(auctionId, function (result) {
        if (result["ERROR"] && result["ERROR"] === "404") {
            return res.status(404).send("Not found.")
        }
        if (result["ERROR"]) {
            console.log(result);
            return res.status(500).send("Internal server error");
        }

        auth.getAuthenticatedUser(req.get("X-Authorization")).then((currentUser) => {
            if (currentUser !== result["sellerId"]) {
                return res.status(401).send("Unauthorized");
            }
            if (!fs.existsSync("./public/assets/images/" + auctionId)) {
                return res.status(404).send("Not found.");
            }
            fs.unlink("./public/assets/images/" + auctionId, (err) => {
                if (err) {
                    return res.status(500).send("Internal server error");
                } else {
                    return res.status(201).send("OK");
                }
            });
        }).catch((err) => {
            console.log(err);
            return res.status(401).send("Unauthorized");
        });
    });
};