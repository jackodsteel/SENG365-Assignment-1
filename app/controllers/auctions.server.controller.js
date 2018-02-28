"use strict";

const Auction = require("../models/auctions.server.model");
const auth = require("./authentication.server.controller");
const constants = require("../../config/constants");

exports.list = function (req, res) {
    Auction.getAll(function (result) {
        res.json(result);
    });
};

exports.create = function (req, res) {

    /* Validity checks */
    /* Regex checks for correct datetime format for mysql */
    /* Category is above 0 and less than the max category */
    /* Title and description are strings */
    if (!(req.body.categoryId &&
            req.body.title &&
            req.body.description &&
            req.body.startDateTime &&
            req.body.endDateTime &&
            req.body.reservePrice &&
            req.body.startingBid &&
            constants.DATETIME_REGEX.test(req.body.startDateTime) &&
            constants.DATETIME_REGEX.test(req.body.endDateTime) &&
            req.body.categoryId > 0 &&
            req.body.categoryId <= constants.NUM_CATEGORIES &&
            typeof(req.body.title) === "string" &&
            typeof(req.body.description) === "string")) {
        console.log(req.body.categoryId &&
            req.body.title &&
            req.body.description &&
            req.body.startDateTime &&
            req.body.endDateTime &&
            req.body.reservePrice &&
            req.body.startingBid);
        console.log(constants.DATETIME_REGEX.test(req.body.startDateTime) &&
            constants.DATETIME_REGEX.test(req.body.endDateTime));
        console.log(req.body.categoryId > 0 &&
            req.body.categoryId <= constants.NUM_CATEGORIES);
        console.log(typeof(req.body.title) === "string" &&
            typeof(req.body.description) === "string");
        return res.status(400).send("Malformed auction data");
    }
    let created = new Date().toISOString().slice(0, 19).replace("T", " ");

    /* Auth, get current user */

    async function getId(token) {
        return await auth.getAuthenticatedUser(token);
    }

    getId(req.get("X-Authorization")).then((id) => {
        let userData = [
            req.body.title,
            req.body.categoryId,
            req.body.description,
            req.body.reservePrice,
            req.body.startingBid,
            created,
            req.body.startDateTime,
            req.body.endDateTime,
            id
        ];
        console.log(constants.DATETIME_REGEX.test(req.body.startDateTime));
        console.log(userData);
        Auction.insert(userData, function (result) {
            console.log(result);
            if (result.insertId) {
                return res.json({"id": result.insertId});
            } else {
                return res.status(400).send("Malformed request");
            }
        });
    });
};

exports.view = function (req, res) {
    return null;
};

exports.update = function (req, res) {
    return null;
};

exports.viewBid = function (req, res) {
    return null;
};
exports.makeBid = function (req, res) {
    return null;
};