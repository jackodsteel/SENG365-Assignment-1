"use strict";

const mysql = require("mysql");

let state = {
    pool: null,
    ms_pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: "mysql3.csse.canterbury.ac.nz",
        user: "jes143",
        password: "94921224",
        database: "jes143"
    });

    state.ms_pool = mysql.createPool({
        host: "mysql3.csse.canterbury.ac.nz",
        user: "jes143",
        password: "94921224",
        database: "jes143",
        multipleStatements: true
    });

    done();
};

exports.get_pool = function () {
    return state.pool;
};

exports.get_ms_pool = function () {
    return state.ms_pool;
};