'use strict';
/*SERVICES*/
var userService = require('./crud/userService'),
    getService  = require('./crud/getService'),
/*CRYPT MODULE*/
    bcrypt = require('bcrypt-nodejs');

module.exports = {

    login: function (body, session, callback) {
        /*var cryptPassword = bcrypt.hashSync(body.password);*/
        userService.get(body.email, function (user) {
            if (user && bcrypt.compareSync(body.password, user.password)) {
                delete user.password;
                session.user = user;
                getService.setJoins(session.user, function() {
                    callback(true);
                });
            } else {
                callback(false);
            }
        });
    },

    getSession: function (session, callback) {
        //Look for the user data in database to always have fresh data
        if (session.user) {
            userService.get(session.user.email, function (user) {
                delete user.password;
                session.user = user;
                getService.joinMediaData(session.user, function() {
                    callback(session.user);
                });
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