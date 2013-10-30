'use strict';
var collectionService = require("../collectionService"),
    constantsService = require("../constantsService");
module.exports = {
    download : function (dbCon, id, callback) {
        var collection  = constantsService.collections.media,
            query       = {_id: collectionService.getFormattedId(dbCon, id)};
        collectionService.find(dbCon, collection, query, null, null, null, null, function(err, content) {
            callback(content);
        });
    }
};