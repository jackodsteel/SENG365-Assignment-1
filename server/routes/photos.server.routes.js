"use strict";

const photos = require("../controllers/photos.server.controller");

module.exports = function (app) {
    app.route("/auctions/:auctionId/photos")
        .get(photos.list)
        .post(photos.add);

    app.route("/auctions/:auctionId/photos/:photoId")
        .get(photos.view)
        .put(photos.update)
        .delete(photos.delete);
};