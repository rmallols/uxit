'use strict';
module.exports = {

    _defaultDbId: 'administration',

    connect: function(databaseId, callback) {
        var connectionUrl = this._getConnectionUrl(databaseId);
        MongoDbService.connect(connectionUrl, function(err, db) {
            callback(err, db);
        });
    },

    getAdminDbId: function() {
        return this._defaultDbId;
    },

    getDatabases: function(session, callback) {
        var normalizedDbs = [], self = this;
        self.connect(self._defaultDbId, function(err, db) {
            if(db) {
                db.admin().listDatabases(function(err, dbs) {
                    if(dbs.databases && dbs.databases.length > 0) {
                        //Convert results to an index-based array
                        dbs.databases.forEach(function(database) {
                            if(!self._isPrivateDatabase(database.name)) { //Don't include private databases
                                database._id = database.name; //Keep the normalized _id syntax
                                normalizedDbs.push(database);
                            }
                        });
                    }
                    callback(utilsService.normalizeQueryResultsFormat(normalizedDbs));
                });
            } else {
                callback(utilsService.normalizeQueryResultsFormat(normalizedDbs));
            }
        });
    },

    existsDatabase: function(dbCon, databaseId, session, callback) {
        if(this._isHostDb()) {
            this.getDatabases(session, function(databases) {
                var exists = false;
                if(databases.results.length) {
                    databases.results.forEach(function(database) {
                        if(database.name === databaseId) {
                            exists = true;
                        }
                    });
                    callback(exists);
                } else {
                    callback(false);
                }

            });
        } else {
            callback(true);
        }
    },

    createDatabase: function(body, session, callback) {
        var self = this;
        self.connect(body.name, function(err, dbCon) {
            //db.addUser('test', 'test', function() {
                collectionService.initializeCollections(dbCon, function() { //Initialize their collections
                    self.getDatabases(session, function(result) {
                        callback(result);
                    });
                });
            //});
        });
    },

    updateDatabase: function(databaseId, body, session, callback) {
        var self = this, dstDbId = body.name;
        self._copyDatabase(databaseId, dstDbId, function(result) {
            self.deleteDatabase(databaseId, session, function() {
                callback(result);
            });
        });
    },

    deleteDatabase: function(databaseId, session, callback) {
        var self = this;
        self.connect(databaseId, function(err, db) {
            db.dropDatabase(function() {
                self.getDatabases(session, function(result) {
                    callback(result);
                });
            });
        });
    },

    importDatabase: function(dbCon, importedPortal, session, callback) {
        var zipObj = zipService.getZipObj(importedPortal.path);
        var zipFiles = zipService.readFiles(zipObj);
        zipFiles.forEach(function(zipFile) {
            var collection  = zipFile.entryName.split('.json')[0],
                data        = zipFile.getData().toString('utf8');
            collectionService.importCollection(dbCon, collection, data, function() {
                callback({});
            });
        });
    },

    exportDatabase: function(dbCon, databaseId, session, callback) {
        var zipObj = zipService.getZipObj();
        collectionService.getCollectionNames(dbCon, function(err, collections){
            collections.forEach(function(collection, index) {
                collectionService.findAll(dbCon, collection, function (err, documents) {
                    zipService.addFile(zipObj, collection + '.json', new Buffer(JSON.stringify(documents)));
                    if(index + 1 === collections.length) {
                        callback(zipService.getBuffer(zipObj));
                    }
                });
            });
        });
    },

    _getConnectionUrl: function(databaseId) {
        var host = pkg.dbHost,
            port = pkg.dbPort,
            user = pkg.dbUser,
            password = pkg.dbPassword,
            credentials = (user && password) ? user + ':' + password + '@': '',
            endpoint = host + ':' + port + '/' + databaseId;
        return 'mongodb://' + credentials + endpoint;
    },

    _isHostDb: function() {
        return pkg.mode === constantsService.modes.host;
    },

    _copyDatabase: function(srcDbId, dstDbId, callback) {
        var self = this, commandOptions = { copydb: 1, fromdb: srcDbId, todb: dstDbId };
        self.connect(self._defaultDbId, function(err, db) {
            var dbCon = db.admin();
            self._runCommand(dbCon, commandOptions, function(err, result) {
                callback(result);
            });
        });
    },

    _isPrivateDatabase: function(databaseId) {
        var privateDbs = ['mydb', 'local', 'admin'], isPrivate = false;
        privateDbs.forEach(function(privateDb) {
            if(databaseId === privateDb) {
                isPrivate = true;
            }
        });
        return isPrivate;
    },

    _runCommand: function(dbCon, command, callback) {
        if(dbCon.command) {
            dbCon.command(command, function(err, result) {
                callback(err, result);
            });
        } else {
            dbCon.runCommand(command, function(err, result) {
                callback(err, result);
            });
        }
    }
};

//Load all the dependencies AFTER the module has been defined in order to guarantee
//that the database connection has been properly initialized
var MongoDbService      = require('mongodb').MongoClient,
    collectionService   = require('./collectionService'),
    zipService          = require('./zipService'),
    constantsService    = require('./constantsService'),
    utilsService        = require("./utilsService"),
    pkg                 = require('../package.json');