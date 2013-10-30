'use strict';
module.exports = {

    _initializedCollectionsCounter: 0,

    count: function(dbCon, collection, query, callback) {
        dbCon.collection(collection).count(query, function (err, totalSize) {
            callback(err, totalSize);
        });
    },

    find: function(dbCon, collection, query, projection, sort, skip, pageSize, callback) {
        if(!query)      { query = {}; }
        if(!projection) { projection = {}; }
        dbCon.collection(collection).find(query, projection).sort(sort).skip(skip).limit(pageSize, function (err, documents) {
            documents.toArray(function(err, documents) {
                callback(err, documents);
            });
        });
    },

    findOne: function(dbCon, collection, query, projection, callback) {
        if(!projection) { projection = {}}
        dbCon.collection(collection).findOne(query, projection, function (err, document) {
            callback(err, document);
        });
    },

    create: function(dbCon, collection, data, session, callback) {
        utilsService.addCreateSignature(data, session);
        dbCon.collection(collection).save(data, function (err, newContent) {
            callback(err, newContent);
        });
    },

    update: function(dbCon, collection, id, data, session, callback) {
        utilsService.addUpdateSignature(data, session);
        dbCon.collection(collection).update({_id: id}, {$set: data}, function (err, updatedDocument) {
            callback(err, updatedDocument);
        });
    },

    delete: function(dbCon, collection, id, callback) {
        var _id = this.getFormattedId(dbCon, id.toString());
        dbCon.collection(collection).remove({_id: _id}, function () {
            callback({});
        });
    },

    initializeCollections: function(dbCon, callback) {
        var self = this;
        Object.keys(constantsService.collections).forEach(function(collectionKey) {
            var collection = constantsService.collections[collectionKey];
            self._existsCollection(dbCon, collection, function(exists) {
                if(exists) {    //The collection already exists -> return
                    if(self._registerInitializationAndFinish() && callback) { callback() }
                } else {        //The collection doesn't exists yet -> initialize it
                    self._initializeCollection(dbCon, collection, function() {
                        if(self._registerInitializationAndFinish() && callback) { callback() }
                    });
                }
            });
        });
    },

    _registerInitializationAndFinish: function() {
        this._initializedCollectionsCounter++;
        if(this._initializedCollectionsCounter === Object.keys(constantsService.collections).length) {
            this._initializedCollectionsCounter = 0;
            return true;
        }
        return false;
    },

    _existsCollection: function(dbCon, collection, callback) {
        var exists = false;
        dbCon.collectionNames(function(err, collectionNames) {
            if(collectionNames.length > 0) {
                collectionNames.forEach(function(collectionName) {
                    if(collectionName === collection) {
                        exists = true;
                    }
                });
            }
            callback(exists);
        });
    },

    _initializeCollection: function (dbCon, collection, callback) {
        var self = this;
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            consoleService.success(collection + ' collection initialized');
            if(data && data.length) {
                self._createDocuments(dbCon, collection, data, function() {
                    if(callback) { callback() }
                })
            } else {
                if(callback) { callback() }
            }
        });
    },

    _createDocuments: function(dbCon, collection, data, callback) {
        var documents = JSON.parse(data), session = { user: {} };
        if(utilsService.isArray(documents)) {
            this._createMultipleDocuments(dbCon, collection, documents, session, function() {
                callback();
            });
        } else {
            this._createSingleDocument(dbCon, collection, documents, session, function() {
                callback();
            });
        }
    },

    _createMultipleDocuments: function(dbCon, collection, documents, session, callback) {
        var createdDocuments = 0;
        documents.forEach(function(document) { //Create each document of the given collection
            createService.create(dbCon, collection, document, session, function() {
                createdDocuments++;
                if(createdDocuments === documents.length) {
                    callback();
                }
            });
        });
    },

    _createSingleDocument: function(dbCon, collection, document, session, callback) {
        createService.create(dbCon, collection, document, session, function() {
            callback();
        });
    },

    //Get the formatted of the mongodb collection, as it will usually be a native object id,
    //but in some specific situations, it could be a plain string (for instance, in the case of the portal names)
    getFormattedId: function (dbCon, originalId) {
        var _id;
        try {
            _id = new ObjectID(originalId);
        } catch (ex) {
            _id = originalId;
        }
        return _id;
    }
};

var createService       = require("./crud/createService"),
    fileSystemService   = require("./fileSystemService"),
    consoleService      = require('./consoleService'),
    utilsService        = require("./utilsService"),
    constantsService    = require("./constantsService"),
    ObjectID            = require('mongodb').ObjectID;