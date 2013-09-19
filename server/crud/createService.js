'use strict';
var utilsService = require("../utilsService"),
    dbService = require("../dbService");
module.exports = {
    create : function (collection, body, session, callback) {
        if(utilsService.isArray(body)) {
            this._createMultipleDocuments(body, collection,  body.length, [], session, function(result) {
                callback(result);
            });
        } else {
            this._createSingleDocument(body, collection, session, function(result) {
                callback(result);
            });
        }
    },

    _createSingleDocument: function (document, collection, session, callback) {
        utilsService.addCreateSignature(document, session);
        dbService.getDbConnection().collection(collection).save(document, function (err, newItem) {
            callback(newItem);
        });
    },

    _createMultipleDocuments: function (documents, collection, total, result, session, callback) {
        var self = this;
        var document = documents.pop();
        utilsService.addCreateSignature(document, session);
        self._createSingleDocument(document, collection, session, function(newItem) {
            result.push(newItem);
            if (--total) {
                self._createMultipleDocuments(documents, collection, total, result, session, callback);
            }
            else {  //At this point, all the documents have been saved
                callback(result);
            }
        });
    }
};