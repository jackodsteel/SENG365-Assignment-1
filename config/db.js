"use strict";

const mysql = require("mysql");

let state = {
    pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: "mysql3.csse.canterbury.ac.nz",
        user: "jes143",
        password: "94921224",
        database: "jes143"
    });
    done();
};

exports.get_pool = function () {
    return state.pool;
};