'use strict';
var utilsService = require("../utilsService");
module.exports = {
    update : function (db, collection, id, body, session, callback) {
        utilsService.addUpdateSignature(body, session);
        //Normalize the way the model is going to be updated
        var updatedModel = utilsService.normalizeModel(body);
        //noinspection JSUnresolvedVariable
        db.collection(collection).update({_id: utilsService.getFormattedId(db, id)}, {$set: updatedModel}, function () {
            callback({})
        });
    }
};