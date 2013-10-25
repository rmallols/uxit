'use strict';
module.exports = {

    dbConnection: null,
    _adminDbId: 'admin',
    _initializedCollectionsCounter: 0,

    connect: function (databaseId) {
        return mongoJsService.connect(databaseId);
    },

    getAdminDbId: function() {
        return this._adminDbId;
    },

    getDatabases: function(dbCon, session, callback) {
        var normalizedDbs = [], self = this;
        self._runCommand(dbCon, {listDatabases: 1}, this._adminDbId, function(err, result) {
            //Convert results to an index-based array
            result.databases.forEach(function(database) {
                if(!self._isPrivateDatabase(database.name)) { //Don't include private databases
                    database._id = database.name; //Keep the normalized _id syntax
                    normalizedDbs.push(database);
                }
            });
            callback(utilsService.normalizeQueryResultsFormat(normalizedDbs));
        });
    },

    existsDatabase: function(dbCon, databaseId, session, callback) {
        var exists = false;
        this.getDatabases(dbCon, session, function(databases) {
            databases.results.forEach(function(database) {
                if(database.name === databaseId) {
                    exists = true;
                }
            });
            callback(exists);
        });
    },

    createDatabase: function(dbCon, body, session, callback) {
        var self = this,
            dbConnection = self.connect(body.name); //Create the database explicitly
        self._initializeCollections(dbConnection, body.name, function() { //Initialize their collections
            self.getDatabases(dbCon, session, function(result) {
                callback(result);
            });
        });
    },

    updateDatabase: function(dbCon, databaseId, body, session, callback) {
        var self = this, dstDbId = body.name;
        self._copyDatabase(dbCon, databaseId, dstDbId, function(result) {
            self.deleteDatabase(databaseId, session, function() {
                callback(result);
            })
        });
    },

    deleteDatabase: function(dbCon, databaseId, session, callback) {
        var self = this;
        self._runCommand(dbCon, {dropDatabase: 1}, databaseId, function(/*err, result*/) {
            self.getDatabases(dbCon, session, function(result) {
                callback(result);
            });
        });
    },

    //Get the formatted of the mongodb collection, as it will usually be a native object id,
    //but in some specific situations, it could be a plain string (for instance, in the case of the portal names)
    getFormattedId: function (dbCon, originalId) {
        var _id;
        try {
            _id = dbCon.ObjectId(originalId);
        } catch (ex) {
            _id = originalId;
        }
        return _id;
    },

    _copyDatabase: function(dbCon, srcDbId, dstDbId, callback) {
        var commandOptions = {
            copydb: 1,
            fromdb: srcDbId,
            todb: dstDbId
        };
        this._runCommand(dbCon, commandOptions, this._adminDbId, function(err, result) {
            callback(result);
        });
    },

    _isPrivateDatabase: function(databaseId) {
        var privateDbs = ['mydb', 'local'], isPrivate = false;
        privateDbs.forEach(function(privateDb) {
            if(databaseId === privateDb) {
                isPrivate = true;
            }
        });
        return isPrivate;
    },

    _initializeCollections: function(dbCon, databaseId, callback) {
        var self = this;
        Object.keys(constantsService.collections).forEach(function(collectionKey) {
            var collection = constantsService.collections[collectionKey];
            self._existsCollection(dbCon, collection, databaseId, function(exists) {
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

    _existsCollection: function(dbCon, collection, database, callback) {
        this._runCommand(dbCon, { count: collection }, database, function(err, result) {
            var exists = !err && result.ok && result.n > 0;
            if(callback) { callback(exists); }
        });
    },

    _initializeCollection: function (databaseId, collection, callback) {
        var self = this, dbConnection = self.connect(databaseId);
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

    _runCommand: function(dbCon, command, databaseId, callback) {
        var dbConnection;
        if(databaseId) { //Check if the command has to be executed in a specific db (i.e. admin)
            dbConnection = this.connect(databaseId);
        } else { //Otherwise, use the current db connection
            dbConnection = dbCon;
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