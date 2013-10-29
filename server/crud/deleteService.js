'use strict';
var collectionService   = require("../collectionService");
module.exports = {
    delete : function (dbCon, collection, id, callback) {
        collectionService.delete(dbCon, collection, id, function() {
            callback({});
        });
    }
};