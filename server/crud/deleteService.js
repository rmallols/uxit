'use strict';
var dbService = require("../dbService");
module.exports = {
    delete : function (collection, id, callback) {
        var dbConnection = dbService.getDbConnection();
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        dbConnection.collection(collection).remove({_id: dbConnection.ObjectId(id.toString())}, function () {
            callback({});
        });
    }
};