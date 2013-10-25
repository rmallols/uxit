'use strict';
var dbService = require("../dbService");

module.exports = {
    count : function (dbCon, collection, filter, callback) {
        dbCon.collection(collection).count(filter, function (err, totalSize) {
            callback(totalSize);
        });
    }
};