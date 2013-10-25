'use strict';
module.exports = {

    _adminDbId: 'admin',
    _initializedCollectionsCounter: 0,

    connect: function (databaseId) {
        var host = pkg.dbHost,
            port = pkg.dbPort,
            user = pkg.dbUser,
            password = pkg.dbPassword,
            credentials = user + ':' + password,
            endpoint = host + ':' + port + '/' + databaseId,
            url = 'mongodb://' + credentials + '@' + endpoint;
        return mongoJsService.connect(url);
    },

    getAdminDbId: function() {
        return this._adminDbId;
    },

    getDatabases: function(session, callback) {
        var normalizedDbs = [], self = this, dbCon = self.connect(self._adminDbId);
        self._runCommand(dbCon, {listDatabases: 1}, function(err, result) {
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
        if(pkg.mode === constantsService.modes.host) {
            var exists = false;
            this.getDatabases(session, function(databases) {
                databases.results.forEach(function(database) {
                    if(database.name === databaseId) {
                        exists = true;
                    }
                });
                callback(exists);
            });
        } else {
            callback(true);
        }
    },

    createDatabase: function(body, session, callback) {
        var self = this,
            dbCon = self.connect(body.name); //Create the database explicitly
        self._initializeCollections(dbCon, function() { //Initialize their collections
            self.getDatabases(session, function(result) {
                callback(result);
            });
        });
    },

    updateDatabase: function(databaseId, body, session, callback) {
        var self = this, dstDbId = body.name;
        self._copyDatabase(databaseId, dstDbId, function(result) {
            self.deleteDatabase(databaseId, session, function() {
                callback(result);
            })
        });
    },

    deleteDatabase: function(databaseId, session, callback) {
        var self = this, dbCon = self.connect(databaseId);
        self._runCommand(dbCon, {dropDatabase: 1}, function(/*err, result*/) {
            self.getDatabases(session, function(result) {
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

    _copyDatabase: function(srcDbId, dstDbId, callback) {
        var commandOptions = {
                copydb: 1,
                fromdb: srcDbId,
                todb: dstDbId
            },
            dbCon = this.connect(this._adminDbId);
        this._runCommand(dbCon, commandOptions, function(err, result) {
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

    _initializeCollections: function(dbCon, callback) {
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
        this._runCommand(dbCon, { count: collection }, function(err, result) {
            var exists = !err && result.ok && result.n > 0;
            if(callback) { callback(exists); }
        });
    },

    _initializeCollection: function (dbCon, collection, callback) {
        var self = this;
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            if(data && data.length) {
                self._createDocuments(dbCon, collection, data, function() {
                    consoleService.success(collection + " database initialized");
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

    _runCommand: function(dbCon, command, callback) {
        dbCon.runCommand(command, function(err, result) {
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
    utilsService        = require("./utilsService"),
    pkg                 = require('../package.json');