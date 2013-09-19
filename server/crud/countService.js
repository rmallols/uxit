'use strict';
var dbService = require("../dbService");

module.exports = {
    count : function (collection, filter, callback) {
        dbService.getDbConnection().collection(collection).count(filter, function (err, totalSize) {
            callback(totalSize);
        });
    }
};