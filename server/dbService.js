'use strict';
module.exports = {

    dbConnection: null,

    _initializedCollectionsCounter: 0,

    connect: function () {
        var databaseUrl = "uxit";
        this.dbConnection = require("mongojs").connect(databaseUrl);
    },

    getDbConnection: function() {
        return this.dbConnection;
    },

    initializeCollections: function(callback) {
        var self = this;
        Object.keys(constantsService.collections).forEach(function(collectionKey) {
            var collection = constantsService.collections[collectionKey];
            self._existsCollection(collection, function(exists) {
                if(exists) {    //The collection already exists -> return
                    if(self._registerInitializationAndFinish() && callback) { callback() }
                } else {        //The collection doesn't exists yet -> initialize it
                    self._initializeCollection(collection, function() {
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

    _existsCollection: function(collection, callback) {
        this.getDbConnection().runCommand({ count: collection }, function(err, result) {
            var exists = !err && result.ok && result.n > 0;
            if(callback) { callback(exists); }
        });
    },

    _initializeCollection: function (collection, callback) {
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            if(data && data.length) {
                createService.create(collection, JSON.parse(data), { user: {} }, function() {
                    consoleService.success(collection + " database initialized");
                    if(callback) { callback() }
                });
            } else {
                if(callback) { callback() }
            }
        });
    }
};

//Load all the dependencies AFTER the module has been defined in order to guarantee
//that the database connection has been properly initialized
var createService       = require("./crud/createService"),
    fileSystemService   = require("./fileSystemService"),
    constantsService    = require('./constantsService'),
    consoleService      = require('./consoleService');