'use strict';
module.exports = {

    dbConnection: null,
    _adminDbId: 'admin',
    _initializedCollectionsCounter: 0,

    connect: function (databaseId) {
        this.dbConnection = mongoJsService.connect(databaseId);
    },

    getDatabases: function(session, callback) {
        this._runCommand({listDatabases: 1}, this._adminDbId, function(err, result) {
            var normalizedDbs = [];
            //Convert results to an index-based array
            result.databases.forEach(function(database) {
                database._id = database.name; //Keep the normalized _id syntax
                normalizedDbs.push(database);
            });
            callback(utilsService.normalizeQueryResultsFormat(normalizedDbs));
        });
    },

    createDatabase: function(body, session, callback) {
        var self = this;
        mongoJsService.connect(body.name); //Create the database explicitly
        self._initializeCollections(body.name, function() { //Initialize their collections
            self.getDatabases(session, function(result) {
                callback(result);
            });
        });
    },

    updateDatabase: function(databaseId, body, session, callback) {
        var self = this, dstDbId = body.name;
        self.copyDatabase(databaseId, dstDbId, function(result) {
            self.deleteDatabase(databaseId, session, function() {
                callback(result);
            })
        });
    },

    copyDatabase: function(srcDbId, dstDbId, callback) {
        var commandOptions = {
            copydb: 1,
            fromdb: srcDbId,
            todb: dstDbId
        };
        this._runCommand(commandOptions, this._adminDbId, function(err, result) {
            callback(result);
        });
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

    _initializeCollections: function(databaseId, callback) {
        var self = this;
        Object.keys(constantsService.collections).forEach(function(collectionKey) {
            var collection = constantsService.collections[collectionKey];
            self._existsCollection(collection, databaseId, function(exists) {
                if(exists) {    //The collection already exists -> return
                    if(self._registerInitializationAndFinish() && callback) { callback() }
                } else {        //The collection doesn't exists yet -> initialize it
                    self._initializeCollection(databaseId, collection, function() {
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

    _existsCollection: function(collection, database, callback) {
        this._runCommand({ count: collection }, database, function(err, result) {
            var exists = !err && result.ok && result.n > 0;
            if(callback) { callback(exists); }
        });
    },

    _initializeCollection: function (databaseId, collection, callback) {
        var self = this, dbConnection = mongoJsService.connect(databaseId);
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            if(data && data.length) {
                self._createDocuments(dbConnection, collection, data, function() {
                    consoleService.success(collection + " database initialized");
                    if(callback) { callback() }
                })
            } else {
                if(callback) { callback() }
            }
        });
    },

    _createDocuments: function(dbConnection, collection, data, callback) {
        var documents = JSON.parse(data), session = { user: {} };
        if(utilsService.isArray(documents)) {
            this._createMultipleDocuments(dbConnection, collection, documents, session, function() {
                callback();
            });
        } else {
            this._createSingleDocument(dbConnection, collection, documents, session, function() {
                callback();
            });
        }
    },

    _createMultipleDocuments: function(dbConnection, collection, documents, session, callback) {
        var createdDocuments = 0;
        documents.forEach(function(document) { //Create each document of the given collection
            createService.create(dbConnection, collection, document, session, function() {
                createdDocuments++;
                if(createdDocuments === documents.length) {
                    callback();
                }
            });
        });
    },

    _createSingleDocument: function(dbConnection, collection, document, session, callback) {
        createService.create(dbConnection, collection, document, session, function() {
            callback();
        });
    },

    _runCommand: function(command, databaseId, callback) {
        var dbConnection;
        if(databaseId) { //Check if the command has to be executed in a specific db (i.e. admin)
            dbConnection = mongoJsService.connect(databaseId);
        } else { //Otherwise, use the current db connection
            dbConnection = this.dbConnection;
        }
        dbConnection.runCommand(command, function(err, result) {
            callback(err, result);
        });
    }
};

//Load all the dependencies AFTER the module has been defined in order to guarantee
//that the database connection has been properly initialized
var mongoJsService      = require("mongojs"),
    createService       = require("./crud/createService"),
    fileSystemService   = require("./fileSystemService"),
    constantsService    = require('./constantsService'),
    consoleService      = require('./consoleService'),
    utilsService        = require("./utilsService");