const db = require('../../config/db');

exports.getAll = function (done) {
    db.get_pool().query('SELECT * FROM auction', function (err, rows) {

        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};

exports.getOne = function (auctionId, done) {
    db.get_pool().query('SELECT * FROM auction WHERE auction_id = ?', auctionId, function (err, rows) {

        if (err) return done(err);

        done(rows);
    });
};

exports.insert = function () {
    return null;
};

exports.alter = function () {
    return null;
};

exports.remove = function () {
    return null;
};
