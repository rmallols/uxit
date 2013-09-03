'use strict';
var createService       = require("./crud/createService"),
    fileSystemService   = require("./fileSystemService"),
    constantsService    = require('./constantsService'),
    consoleService      = require('./consoleService');
module.exports = {

    _initializedCollectionsCounter: 0,

    connect: function () {
        var databaseUrl = "uxit";
        return require("mongojs").connect(databaseUrl);
    },

    initializeCollections: function(db, callback) {
        var self = this;
        Object.keys(constantsService.collections).forEach(function(collectionKey) {
            var collection = constantsService.collections[collectionKey];
            self._existsCollection(db, collection, function(exists) {
                if(exists) {    //The collection already exists -> return
                    if(self._registerInitializationAndFinish() && callback) { callback() }
                } else {        //The collection doesn't exists yet -> initialize it
                    self._initializeCollection(db, collection, function() {
                        if(self._registerInitializationAndFinish() && callback) { callback() }
                    });
                }
            });
        });
    },

    _registerInitializationAndFinish: function() {
        this._initializedCollectionsCounter++;
        return this._initializedCollectionsCounter === Object.keys(constantsService.collections).length;
    },

    _existsCollection: function(db, collection, callback) {
        db.runCommand({ count: collection }, function(err, result) {
            var exists = !err && result.ok && result.n > 0;
            if(callback) { callback(exists); }
        });
    },

    _initializeCollection: function (db, collection, callback) {
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            if(data && data.length) {
                createService.create(db, collection, JSON.parse(data), { user: {} }, function() {
                    consoleService.success(collection + " database initialized");
                    if(callback) { callback() }
                });
            } else {
                if(callback) { callback() }
            }
        });
    }
};