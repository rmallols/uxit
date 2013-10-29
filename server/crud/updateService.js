'use strict';
var utilsService    = require("../utilsService"),
    dbService       = require("../dbService"),
    collectionService = require("../collectionService");

module.exports = {
    update : function (dbCon, collection, id, body, session, callback) {
        //Normalize the way the model is going to be updated
        var updatedModel = utilsService.normalizeModel(body),
            _id = collectionService.getFormattedId(dbCon, id);
        //noinspection JSUnresolvedVariable
        collectionService.update(dbCon, collection, _id, updatedModel, session, function() {
            callback({});
        });
    }
};