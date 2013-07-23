'use strict';
module.exports = {
    delete : function (db, collection, id, callback) {
        //noinspection JSUnresolvedVariable
        db.collection(collection).remove({_id: db.ObjectId(id.toString())}, function () {
            callback({});
        });
    }
};