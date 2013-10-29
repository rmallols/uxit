'use strict';
var getService          = require("./getService"),
    utilsService        = require("../utilsService"),
/*CRYPT MODULE*/
    bcrypt              = require('bcrypt-nodejs'),
    dbService           = require("../dbService"),
    collectionService   = require("../collectionService"),
    constantsService    = require("../constantsService");

module.exports = {

    //Checks if there's other user with the same email
    existsOtherUserWithSameEmail : function (dbCon, id, email, callback) {
        var query = {}, emailFilter = { email: utilsService.insensitive(email) };
        if (id) { //If the user already existed, it's necessary to ensure that the query doesn't return the user itself
            query.q = { $and: [ emailFilter, { _id: { $ne : collectionService.getFormattedId(dbCon, id) }}]};
        } else {
            query.q = emailFilter;
        }
        query.projection = { email: 1};
        getService.get(dbCon, constantsService.collections.users, null, query, function (data) {
            callback(data.totalSize !== 0);
        });
    },

    create : function (dbCon, body, session, callback) {
        this.existsOtherUserWithSameEmail(dbCon, null, body.email, function (existsUser) {
            var collection = constantsService.collections.users;
            if (existsUser) {  //Avoid create new user with already existing mails
                callback(null);
            } else {
                body.password = bcrypt.hashSync(body.password); //Crypt the password
                collectionService.create(dbCon, collection, body, session, function (err, newUser) {
                    callback(newUser);
                });
            }
        });
    },

    update : function (dbCon, id, body, session, callback) {
        this.existsOtherUserWithSameEmail(dbCon, id, body.email, function (existsUser) {
            var collection  = constantsService.collections.users;
            if (existsUser) { //Avoid update new user with already existing mails
                callback(null);
            } else {
                if (body.password) { //Crypt the password if it has been entered by the user
                    body.password = bcrypt.hashSync(body.password);
                }
                //Normalize the way the model is going to be updated
                var updatedModel    = utilsService.normalizeModel(body),
                    _id             = collectionService.getFormattedId(dbCon, id);
                utilsService.addUpdateSignature(body, session);
                //noinspection JSUnresolvedVariable
                collectionService.update(dbCon, collection, _id, updatedModel, session, function () {
                    callback({});
                });
            }
        });
    },

    get: function (dbCon, email, callback) {
        var filter      = { $and: [{email: email}]},
            collection  = constantsService.collections.users;
        collectionService.findOne(dbCon, collection, filter, null, function (err, user) {
            callback(user);
        });
    }
};