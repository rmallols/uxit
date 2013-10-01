'use strict';
var getService          = require("./getService"),
    utilsService        = require("../utilsService"),
/*CRYPT MODULE*/
    bcrypt              = require('bcrypt-nodejs'),
    dbService           = require("../dbService"),
    constantsService    = require("../constantsService");

module.exports = {

    //Checks if there's other user with the same email
    existsOtherUserWithSameEmail : function (id, email, callback) {
        var query = {}, emailFilter = { email: utilsService.insensitive(email) };
        if (id) { //If the user already existed, it's necessary to ensure that the query doesn't return the user itself
            query.q = { $and: [ emailFilter, { _id: { $ne : utilsService.getFormattedId(id) }}]};
        } else {
            query.q = emailFilter;
        }
        query.projection = { email: 1};
        getService.get(constantsService.collections.users, null, query, function (data) {
            callback(data.totalSize !== 0);
        });
    },

    create : function (body, session, callback) {
        this.existsOtherUserWithSameEmail(null, body.email, function (existsUser) {
            if (existsUser) {  //Avoid create new user with already existing mails
                callback(null);
            } else {
                utilsService.addCreateSignature(body, session);
                body.password = bcrypt.hashSync(body.password); //Crypt the password
                dbService.getDbConnection().collection(constantsService.collections.users).save(body, function (err, newUser) {
                    callback(newUser);
                });
            }
        });
    },

    update : function (id, body, session, callback) {
        this.existsOtherUserWithSameEmail(id, body.email, function (existsUser) {
            var collection  = constantsService.collections.users;
            if (existsUser) { //Avoid update new user with already existing mails
                callback(null);
            } else {
                if (body.password) { //Crypt the password if it has been entered by the user
                    body.password = bcrypt.hashSync(body.password);
                }
                //Normalize the way the model is going to be updated
                var updatedModel = utilsService.normalizeModel(body);
                utilsService.addUpdateSignature(body, session);
                //noinspection JSUnresolvedVariable
                dbService.getDbConnection().collection(collection).update({_id: utilsService.getFormattedId(id)}, {$set: updatedModel}, function () {
                    callback({});
                });
            }
        });
    },

    get: function (email, callback) {
        var filter      = { $and: [{email: email}]},
            collection  = constantsService.collections.users;
        dbService.getDbConnection().collection(collection).findOne(filter, function (err, user) {
            callback(user);
        });
    }
};