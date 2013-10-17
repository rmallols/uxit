'use strict';
var utilsService = require("../utilsService"),
    dbService = require("../dbService");
module.exports = {
    create : function (dbConnection, collection, body, session, callback) {
        if(utilsService.isArray(body)) {
            this._createMultipleDocuments(dbConnection, body, collection,  body.length, [], session, function(result) {
                callback(result);
            });
        } else {
            this._createSingleDocument(dbConnection, body, collection, session, function(result) {
                callback(result);
            });
        }
    },

    _createSingleDocument: function (dbConnection, document, collection, session, callback) {
        utilsService.addCreateSignature(document, session);
        dbConnection.collection(collection).save(document, function (err, newItem) {
            callback(newItem);
        });
    },

    _createMultipleDocuments: function (dbConnection, documents, collection, total, result, session, callback) {
        var self = this;
        var document = documents.pop();
        utilsService.addCreateSignature(document, session);
        self._createSingleDocument(dbConnection, document, collection, session, function(newItem) {
            result.push(newItem);
            if (--total) {
                self._createMultipleDocuments(dbConnection, documents, collection, total, result, session, callback);
            }
            else {  //At this point, all the documents have been saved
                callback(result);
            }
        });
    }
};