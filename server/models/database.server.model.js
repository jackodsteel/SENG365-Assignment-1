"use strict";

const db = require("../../config/db");
const fs = require("fs");
const path = require('path');

const reset_database_sql = path.join(__dirname, "../../database/create_database.sql");
const load_data_sql = path.join(__dirname, "../../database/load_data.sql");

exports.reset = function (done) {
    let query_sql = fs.readFileSync(reset_database_sql, "utf8");

    db.get_ms_pool().query(query_sql, function (err, rows) {
        if (err) {
            return done({"ERROR": "Cannot reset database."});
        }
        done(rows);
    });
};

exports.resample = function (done) {
    let query_sql = fs.readFileSync(load_data_sql, "utf8");

    db.get_ms_pool().query(query_sql, function (err, rows) {
        if (err) {
            return done({"ERROR": "Cannot load data into database."});
        }
        done(rows);
    });
};