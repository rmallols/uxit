'use strict';
var collectionService = require("../collectionService");

module.exports = {
    count : function (dbCon, collection, filter, callback) {
        collectionService.count(dbCon, collection, filter, function (err, totalSize) {
            callback(totalSize);
        });
    }
};