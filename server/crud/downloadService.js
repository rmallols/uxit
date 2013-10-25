'use strict';
var dbService = require("../dbService"),
    constantsService = require("../constantsService");
module.exports = {
    download : function (dbCon, id, callback) {
        var collection      = constantsService.collections.media;
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        dbCon.collection(collection).find({_id: dbService.getFormattedId(dbCon, id)}, function (err, content) {
            callback(content);
        });
    }
};