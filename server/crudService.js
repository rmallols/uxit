'use strict';
/*DB SETTINGS*/
var dbService           = require("./dbService");
var appService          = require("./appService");
var cacheService        = require("./cacheService");
var createService       = require("./crud/createService");
var userService         = require("./crud/userService");
var rateService         = require("./crud/rateService");
var getService          = require("./crud/getService");
var getStatsService     = require("./crud/getStatsService");
var updateService       = require("./crud/updateService");
var deleteService       = require("./crud/deleteService");
var downloadService     = require("./crud/downloadService");
var mediaService        = require("./crud/mediaService");
var constantsService    = require('./constantsService');
var db = dbService.connect();

getService.get(db, constantsService.collections.media, null, { projection : { data : 0}}, function (documents) {
    cacheService.initCachedMedia(documents);
    //Cache user once all the media is cached as the former could have references to the latest
    getService.get(db, constantsService.collections.users, null, { projection : { password : 0}}, function (documents) {
        cacheService.initCachedUsers(documents);
    });
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

    initializePortal: function (callback) {
        dbService.initializePortal(db, session, callback);
    },

    initializeApp: function (session, callback) {
        dbService.initializeApp(db, session, callback);
    }
};