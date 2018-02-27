"use strict";

const Auction = require("../models/auctions.server.model");

exports.list = function (req, res) {
    Auction.getAll(function (result) {
        res.json(result);
    });
};

exports.create = function (req, res) {
    return null;
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