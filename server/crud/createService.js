'use strict';
var utilsService = require("../utilsService");
module.exports = {
    create : function (db, collection, body, session, callback) {
        utilsService.addCreateSignature(body, session);
        db.collection(collection).save(body, function (err, newItem) {
            callback(newItem);
        });
    }
};