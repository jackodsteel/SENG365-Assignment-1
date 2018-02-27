const db = require('../../config/db');

exports.getAll = function (done) {
    db.get_pool().query('SELECT * FROM auction_user', function (err, rows) {

        if (err) return done({"ERROR": "Error selecting"});

        return done(rows);
    });
};

exports.getOne = function (userId, done) {
    db.get_pool().query('SELECT * FROM auction_user WHERE user_id = ?', userId, function (err, rows) {

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
