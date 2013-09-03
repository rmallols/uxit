'use strict';
var utilsService = require("../utilsService");
module.exports = {
    create : function (db, collection, body, session, callback) {
        if(utilsService.isArray(body)) {
            this._createMultipleDocuments(db, body, collection,  body.length, [], session, function(result) {
                callback(result);
            });
        } else {
            this._createSingleDocument(db, body, collection, session, function(result) {
                callback(result);
            });
        }
    },

    _createSingleDocument: function (db, document, collection, session, callback) {
        utilsService.addCreateSignature(document, session);
        db.collection(collection).save(document, function (err, newItem) {
            callback(newItem);
        });
    },

    _createMultipleDocuments: function (db, documents, collection, total, result, session, callback) {
        var self = this;
        var document = documents.pop();
        utilsService.addCreateSignature(document, session);
        self._createSingleDocument(db, document, collection, session, function(newItem) {
            result.push(newItem);
            if (--total) {
                self._createMultipleDocuments(db, documents, collection, total, result, session, callback);
            }
            else {  //At this point, all the documents have been saved
                callback(result);
            }
        });
    }
};