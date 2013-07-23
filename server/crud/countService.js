'use strict';
module.exports = {
    count : function (db, collection, filter, callback) {
        db.collection(collection).count(filter, function (err, totalSize) {
            callback(totalSize);
        });
    }
};