"use strict";

const Database = require("../models/database.server.model");
const glob = require("glob");
const fs = require("fs");

exports.reset = function (req, res) {
    Database.reset(function (result) {
        if (result.ERROR) {
            return res.status(500).send("Internal server error");
        } else {
            glob("./public/assets/images/!(default)", function (err, files) {
                if (err) {
                    return res.status(500).send("Internal server error");
                }
                files.forEach(function (file) {
                    fs.unlink(file);
                })
            });
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