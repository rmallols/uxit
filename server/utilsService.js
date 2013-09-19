'use strict';
var dbService = require("./dbService");

module.exports = {

    addCreateSignature : function (body, session) {
        this.addSignature('create', body, session);
    },
    addUpdateSignature : function (body, session) {
        this.addSignature('update', body, session);
    },
    addSignature : function (event, body, session) {
        var currentDate = new Date();
        //Right now, we're skipping storing 'time' metadata because of chart / reporting incompatibility problems
        //The point is that mongoJs (v0.6.4) is not supporting the 'keyf' grouping attribute, which is necessary
        //to group sets of dates, merging them just using the 'date' metadata but avoiding the 'time' metadata
        currentDate.setHours(0, 0, 0, 0);
        body[event] = {
            date: currentDate,
            authorId: session.user._id
        }
    },
    //Get the formatted of the mongodb collection, as it will usually be a native object id,
    //but in some specific situations, it could be a plain string (for instance, in the case of the portal names)
    getFormattedId: function (originalId) {
        var _id;
        try {
            _id = dbService.getDbConnection().ObjectId(originalId);
        } catch (ex) {
            _id = originalId;
        }
        return _id;
    },
    ne: function (str) {
        return { $ne: str };
    },
    like: function (str) {
        return new RegExp("^.*" + str + ".*", 'i');
    },
    insensitive: function (str) {
        return new RegExp("^" + str + "$", 'i');
    },
    //Normalize the way the model is going to be updated
    normalizeModel: function (body) {
        var key, updatedModel = {};
        for (key in body) {
            if (key !== '_id') {
                updatedModel[key] = body[key];
            }
        }
        return updatedModel;
    },
    isArray: function (item) {
        return Object.prototype.toString.call( item ) === '[object Array]';
    }
};