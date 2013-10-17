'use strict';
var utilsService = require("./utilsService");

module.exports = {

    dbConnection: null,

    _initializedCollectionsCounter: 0,

    connect: function (dbUrl) {
        this.dbConnection = require("mongojs").connect(dbUrl);
    },

    getDatabases: function(session, callback) {
        this._runCommand({listDatabases: 1}, 'admin', function(err, result) {
            var normalizedDbs = [];
            //Convert results to an index-based array
            result.databases.forEach(function(database) {
                database._id = database.name; //Keep the normalized _id syntax
                normalizedDbs.push(database);
            });
            callback(utilsService.normalizeQueryResultsFormat(normalizedDbs));
        });
    },

    updateDatabase: function(databaseId, body, session, callback) {
        console.log("UPDATING DATABASE!!!!", databaseId, body);
    },

    deleteDatabase: function(databaseId, session, callback) {
        var self = this;
        self._runCommand({dropDatabase: 1}, databaseId, function(/*err, result*/) {
            self.getDatabases(session, function(result) {
                callback(result);
            });
        });
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

    _runCommand: function(command, databaseId, callback) {
        var adminDbConnection = require("mongojs").connect(databaseId);
        adminDbConnection.runCommand(command, function(err, result) {
            callback(err, result);
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