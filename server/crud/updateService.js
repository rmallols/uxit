'use strict';
var utilsService    = require("../utilsService"),
    dbService       = require("../dbService");

module.exports = {
    update : function (collection, id, body, session, callback) {
        utilsService.addUpdateSignature(body, session);
        //Normalize the way the model is going to be updated
        var updatedModel = utilsService.normalizeModel(body);
        //noinspection JSUnresolvedVariable
        dbService.getDbConnection().collection(collection).update({_id: dbService.getFormattedId(id)}, {$set: updatedModel}, function (result) {
            callback({})
        });
    }
};