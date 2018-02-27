const users = require('../controllers/users.server.controller');

module.exports = function (app) {
    app.route('/users')
        .post(users.create);

    app.route('/users/login')
        .post(users.login);

    app.route('/users/logout')
        .post(users.logout);

    app.route('/users/:userId')
        .get(users.read)
        .patch(users.update);
};