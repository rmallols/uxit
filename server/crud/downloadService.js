'use strict';
var dbService = require("../dbService"),
    constantsService = require("../constantsService");
module.exports = {
    download : function (id, callback) {
        var dbConnection    = dbService.getDbConnection(),
            collection      = constantsService.collections.media;
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        dbConnection.collection(collection).find({_id: dbConnection.ObjectId(id)}, function (err, content) {
            callback(content);
        });
    }
};