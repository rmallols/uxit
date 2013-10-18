'use strict';
/*DB SETTINGS*/
var dbService           = require("./dbService"),
    appService          = require("./appService"),
    sessionService      = require("./sessionService"),
    createService       = require("./crud/createService"),
    userService         = require("./crud/userService"),
    rateService         = require("./crud/rateService"),
    getService          = require("./crud/getService"),
    statsService        = require("./crud/statsService"),
    updateService       = require("./crud/updateService"),
    deleteService       = require("./crud/deleteService"),
    downloadService     = require("./crud/downloadService"),
    mediaService        = require("./crud/mediaService");



module.exports = {

    createDbConnection: function(databaseId) {
        dbService.connect(databaseId);
    },

    create: function (collection, body, session, callback) {
        createService.create(dbService.getDbConnection(), collection, body, session, callback);
    },

    //Give a special handling to the create user action as it requires password crypting
    createUser: function (body, session, callback) {
        userService.create(body, session, callback);
    },

    rate: function (collection, body, session, callback) {
        rateService.rate(collection, body, session, callback);
    },

    get: function (collection, id, query, callback) {
        getService.get(collection, id, query, callback);
    },

    getFirst: function (collection, query, callback) {
        getService.getFirst(collection, query, callback);
    },

    update: function (collection, id, body, session, callback) {
        updateService.update(collection, id, body, session, callback);
    },

    updateUser: function (id, body, session, callback) {
        userService.update(id, body, session, callback);
    },

    delete: function (collection, id, callback) {
        deleteService.delete(collection, id, callback);
    },

    getStats : function (collection, query, session, callback) {
        statsService.getStats(collection, query, session, callback);
    },

    deployApp: function (files, session, callback) {
        appService.deploy(files, session, callback);
    },

    undeployApp: function (id, body, session, callback) {
        appService.undeploy(id, body, session, callback);
    },

    uploadMedia: function (id, files, session, callback) {
        mediaService.upload(id, files, session, callback);
    },

    download: function (id, callback) {
        downloadService.download(id, callback);
    },

    initializeApp: function (session, callback) {
        dbService.initializeApp(session, callback);
    },

    login: function(body, session, callback) {
        sessionService.login(body, session, function (success) {
            callback(success);
        });
    },

    getSession: function(session, callback) {
        sessionService.getSession(session, function (user) {
            callback(user);
        });
    },

    logout: function(session, callback) {
        sessionService.logout(session, function () {
            callback({});
        });
    },

    getAdminDbId: function() {
        return dbService.getAdminDbId();
    },

    getDatabases: function(session, callback) {
        dbService.getDatabases(session, function(result) {
            callback(result);
        });
    },

    existsDatabase: function(databaseId, session, callback) {
        dbService.existsDatabase(databaseId, session, function(result) {
            callback(result);
        });
    },

    createDatabase: function(body, session, callback) {
        dbService.createDatabase(body, session, function(result) {
            callback(result);
        });
    },

    updateDatabase: function(databaseId, body, session, callback) {
        dbService.updateDatabase(databaseId, body, session, function(result) {
            callback(result);
        });
    },

    deleteDatabase: function(databaseId, session, callback) {
        dbService.deleteDatabase(databaseId, session, function(result) {
            callback(result);
        });
    }
};