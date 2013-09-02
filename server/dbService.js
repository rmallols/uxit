'use strict';
var createService       = require("./crud/createService"),
    fileSystemService   = require("./fileSystemService");
module.exports = {

    connect: function () {
        var databaseUrl = "uxit";
        return require("mongojs").connect(databaseUrl)
    },

    existsCollection: function(db, collection) {
        db.runCommand({ count: collection }, function(err, result) {
            return !(!err && result.ok && result.n === 0);
        });
    },

    initializeCollection: function (db, collection, callback) {
        fileSystemService.readFile('../setup/' + collection + '.json', function (err, data) {
            console.log("IN");
            if(data) {
                createService.create(db, collection, JSON.parse(data), { user: {} }, function() {
                    if(callback) { callback() }
                });
            } else {
                if(callback) { callback() }
            }
        });
    }
};