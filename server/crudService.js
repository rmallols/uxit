'use strict';
/*DB SETTINGS*/
var dbService           = require("./dbService"),
    appService          = require("./appService"),
    sessionService      = require("./sessionService"),
    createService       = require("./crud/createService"),
    userService         = require("./crud/userService"),
    rateService         = require("./crud/rateService"),
    getService          = require("./crud/getService"),
    getStatsService     = require("./crud/getStatsService"),
    updateService       = require("./crud/updateService"),
    deleteService       = require("./crud/deleteService"),
    downloadService     = require("./crud/downloadService"),
    mediaService        = require("./crud/mediaService"),
    db = dbService.connect();

dbService.initializeCollections(db, function() {
    getService.cacheResources(db);
});

module.exports = {

    create: function (collection, body, session, callback) {
        createService.create(db, collection, body, session, callback);
    },

    //Give a special handling to the create user action as it requires password crypting
    createUser: function (collection, body, session, callback) {
        userService.create(db, collection, body, session, callback);
    },

    rate: function (collection, body, session, callback) {
        rateService.rate(db, collection, body, session, callback);
    },

    get: function (collection, id, query, callback) {
        getService.get(db, collection, id, query, callback);
    },

    getFirst: function (collection, query, callback) {
        getService.getFirst(db, collection, query, callback);
    },

    update: function (collection, id, body, session, callback) {
        updateService.update(db, collection, id, body, session, callback);
    },

    updateUser: function (collection, id, body, session, callback) {
        userService.update(db, collection, id, body, session, callback);
    },

    delete: function (collection, id, callback) {
        deleteService.delete(db, collection, id, callback);
    },

    getStats : function (collection, query, session, callback) {
        getStatsService.getStats(db, collection, query, session, callback);
    },

    deployApp: function (files, session, callback) {
        appService.deploy(db, files, session, callback);
    },

    undeployApp: function (id, body, session, callback) {
        appService.undeploy(db, id, body, session, callback);
    },

    uploadMedia: function (id, files, session, callback) {
        mediaService.upload(db, id, files, session, callback);
    },

    download: function (id, callback) {
        downloadService.download(db, id, callback);
    },

    initializeApp: function (session, callback) {
        dbService.initializeApp(db, session, callback);
    },

    login: function(body, session, callback) {
        sessionService.login(db, body, session, function (success) {
            callback(success);
        });
    },

    getSession: function(session, callback) {
        sessionService.getSession(db, session, function (user) {
            callback(user);
        });
    },

    logout: function(session, callback) {
        sessionService.logout(session, function () {
            callback({});
        });
    }
};