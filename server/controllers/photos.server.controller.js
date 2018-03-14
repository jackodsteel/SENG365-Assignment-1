"use strict";

const Photo = require("../models/photos.server.model");

exports.list = function (req, res) {
    let auctionId = req.params.auctionId;

    Photo.getAll(auctionId, function (result) {
        res.json(result);
    });
};

exports.add = function (req, res) {
    return null;
};

exports.view = function (req, res) {

    let auctionId = req.params.auctionId;
    let photoId = req.params.photoId;

    return null;
};

exports.update = function (req, res) {
    return null;
};

exports.delete = function (req, res) {
    return null;
};