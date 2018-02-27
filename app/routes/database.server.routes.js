const auctions = require('../controllers/database.server.controller');

module.exports = function (app) {
    app.route('/auctions')
        .get(auctions.list)
        .post(auctions.create);

    app.route('/auctions/:auctionId')
        .get(auctions.view)
        .patch(auctions.update);

    app.route('/auctions/:auctionId/bids')
        .get(auctions.viewBid)
        .post(auctions.makeBid)
};