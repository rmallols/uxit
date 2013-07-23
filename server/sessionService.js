'use strict';
/*DB SETTINGS*/
var databaseUrl = "uxit";
var collections = ["users"];
var db = require("mongojs").connect(databaseUrl, collections);
/*SERVICES*/
var userService = require('./crud/userService');
var cacheService = require('./cacheService');
/*CRYPT MODULE*/
var bcrypt = require('bcrypt-nodejs');

module.exports = {

    login: function (body, session, callback) {
        /*var cryptPassword = bcrypt.hashSync(body.password);*/
        userService.get(db, body.email, function (user) {
            if (user && bcrypt.compareSync(body.password, user.password)) {
                delete user.password;
                session.user = user;
                cacheService.setJoins(session.user);
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    getSession: function (session, callback) {
        //Look for the user data in database to always have fresh data
        if (session.user) {
            userService.get(db, session.user.email, function (user) {
                delete user.password;
                session.user = user;
                cacheService.joinMediaData(session.user);
                callback(session.user);
            });
        } else {
            callback(undefined);
        }
    },

    logout: function (session, callback) {
        if (session) {
            session.destroy();
        }
        callback();
    }
};