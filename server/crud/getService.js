'use strict';
var utilsService        = require("../utilsService"),
    cacheService        = require("../cacheService"),
    constantsService    = require('../constantsService');

module.exports = {

    _normalizeProjection: function (projection) {
        var normalizedProjection = {}, projIdx;
        if (projection) {
            for (projIdx in projection) {
                if (projection.hasOwnProperty(projIdx)) {
                    normalizedProjection[projIdx] = Number(projection[projIdx]);
                }
            }
        }
        return normalizedProjection;
    },

    _normalizeSort: function (sort) {
        var normalizedSort = {};
        if (sort && sort.field && sort.order) {
            normalizedSort[sort.field] = Number(sort.order);
        }
        return normalizedSort;
    },

    exists: function (db, collection, query, callback) {
        this.getFirst(db, collection, query, function (document) {
            callback((document) ? document._id : null);
        });
    },

    getFirst: function (db, collection, query, callback) {
        var projection;
        //Normalize the projection to ensure that the projection value is an integer, an not probably an string
        projection = this._normalizeProjection(query.projection);
        //noinspection JSUnresolvedFunction
        db.collection(collection).findOne(query.q, projection, function (err, document) {
            cacheService.setJoins(document);
            callback(document);
        });
    },

    get : function (db, collection, id, query, callback) {
        var projection  = {}, sort = {}, currentPage = parseInt(query.currentPage, 10) || 0,
            pageSize    = Number(query.pageSize) || 0, getFirstQuery,
            skip        = (currentPage * pageSize) + Number(query.skip) || (currentPage * pageSize);
        if (id) {
            getFirstQuery = { q: { _id: utilsService.getFormattedId(db, id)} }; //Normalize the way the Ids are set
            if (query.projection) { //Add the query projection, if case
                getFirstQuery.projection = query.projection;
            }
            this.getFirst(db, collection, getFirstQuery, function (document) {
                cacheService.setJoins(document);
                callback(document);
            });
        } else {
            //Normalize the projection to ensure that the projection value is an integer, an not probably an string
            projection = this._normalizeProjection(query.projection);
            sort = this._normalizeSort(query.sort);
            //noinspection JSUnresolvedVariable
            db.collection(collection).count(query.q, function (err, totalSize) {
                db.collection(collection).find(query.q, projection).sort(sort).skip(skip).limit(pageSize, function (err, documents) {
                    if (documents) {
                        documents.forEach(function (document) {
                            cacheService.setJoins(document);
                        });
                    }
                    callback({
                        totalSize   : totalSize,
                        results     : documents
                    });
                });
            });
        }
    },

    cacheResources: function(db) {
        var self = this;
        self.get(db, constantsService.collections.media, null, { projection : { data : 0}}, function (documents) {
            cacheService.initCachedMedia(documents);
            //Cache user once all the media is cached as the former could have references to the latest
            self.get(db, constantsService.collections.users, null, { projection : { password : 0}}, function (documents) {
                cacheService.initCachedUsers(documents);
            });
        });
    }
};