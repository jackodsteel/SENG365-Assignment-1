const User = require('../models/user.server.model');

exports.create = function (req, res) {
    return null;
};

exports.login = function (req, res) {
    return null;
};
exports.logout = function (req, res) {
    return null;
};

exports.read = function (req, res) {
    let id = req.params.userId;
    User.getOne(id, function (result) {
        res.json(result);
    });
};

exports.update = function (req, res) {
    return null;
};