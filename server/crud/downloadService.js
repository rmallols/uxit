'use strict';
module.exports = {
    download : function (db, id, callback) {
        db.media.find({_id: db.ObjectId(id)}, function (err, content) {
            callback(content);
        });
    }
};