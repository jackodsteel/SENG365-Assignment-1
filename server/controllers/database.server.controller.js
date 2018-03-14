"use strict";

const Database = require("../models/database.server.model");

exports.reset = function (req, res) {
    Database.reset(function (result) {
        if (result.ERROR) {
            return res.status(400).send("Malformed request.");
        } else {
            return res.status(200).send("OK");
        }
    });
};

exports.resample = function (req, res) {
    Database.resample(function (result) {
        if (result.ERROR) {
            return res.status(400).send("Malformed request.");
        } else {
            return res.status(201).send("Sample of data has been reloaded.");
        }
    });
};