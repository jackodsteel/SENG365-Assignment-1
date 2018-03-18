"use strict";

const auctions = require("../controllers/auctions.server.controller");

module.exports = function (app) {
    app.route("/api/v1/auctions")
        .get(auctions.list)
        .post(auctions.create);

    app.route("/api/v1/auctions/:auctionId")
        .get(auctions.view)
        .patch(auctions.update);

    app.route("/api/v1/auctions/:auctionId/bids")
        .get(auctions.viewBids)
        .post(auctions.makeBid);

    app.route("/api/v1/auctions/:auctionId/photos")
        .get(auctions.getPhoto)
        .post(auctions.addPhoto)
        .delete(auctions.deletePhoto);
};