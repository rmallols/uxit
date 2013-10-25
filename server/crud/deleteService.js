'use strict';
var dbService = require("../dbService");
module.exports = {
    delete : function (dbCon, collection, id, callback) {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        dbCon.collection(collection).remove({_id: dbService.getFormattedId(dbCon, id.toString())}, function () {
            callback({});
        });
    }
};