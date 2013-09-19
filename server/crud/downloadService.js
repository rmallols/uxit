'use strict';
var dbService = require("../dbService");
module.exports = {
    download : function (id, callback) {
        var dbConnection = dbService.getDbConnection();
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        dbConnection.media.find({_id: dbConnection.ObjectId(id)}, function (err, content) {
            callback(content);
        });
    }
};