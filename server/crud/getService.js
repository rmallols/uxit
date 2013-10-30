'use strict';
var utilsService        = require("../utilsService"),
    constantsService    = require('../constantsService'),
    collectionService   = require("../collectionService");

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

    exists: function (dbCon, collection, query, callback) {
        this.getFirst(dbCon, collection, query, function (document) {
            callback((document) ? document._id : null);
        });
    },

    getFirst: function (dbCon, collection, query, callback) {
        var projection;
        //Normalize the projection to ensure that the projection value is an integer, an not probably an string
        projection = this._normalizeProjection(query.projection);
        //noinspection JSUnresolvedFunction
        collectionService.findOne(dbCon, collection, query.q, projection, function (err, document) {
            callback(document);
        });
    },

    get : function (dbCon, collection, id, query, callback) {
        var projection      = {}, sort = {}, currentPage = parseInt(query.currentPage, 10) || 0,
            pageSize        = Number(query.pageSize) || 0, getFirstQuery,
            skip            = (currentPage * pageSize) + Number(query.skip) || (currentPage * pageSize),
            self            = this,
            processedItems  = 0;
        if (id) {
            getFirstQuery = { q: { _id: collectionService.getFormattedId(dbCon, id)} }; //Normalize the way the Ids are set
            if (query.projection) { //Add the query projection, if case
                getFirstQuery.projection = query.projection;
            }
            self.getFirst(dbCon, collection, getFirstQuery, function (document) {
                self.setJoins(dbCon, document, function() {
                    callback(document);
                });
            });
        } else {
            //Normalize the projection to ensure that the projection value is an integer, an not probably an string
            projection = this._normalizeProjection(query.projection);
            sort = this._normalizeSort(query.sort);
            collectionService.count(dbCon, collection, query.q, function (err, totalSize) {
                //dbCon.collection(collection).find(query.q, projection).sort(sort).skip(skip).limit(pageSize, function (err, documents) {
                collectionService.find(dbCon, collection, query.q, projection, sort, skip, pageSize, function(err, documents) {
                    if (documents && documents.length > 0) {
                        documents.forEach(function (document) {
                            self.setJoins(dbCon, document, function() {
                                processedItems++;
                                if(processedItems === documents.length) {
                                    callback(utilsService.normalizeQueryResultsFormat(documents, totalSize));
                                }
                            });
                        });
                    } else {
                        callback(utilsService.normalizeQueryResultsFormat(documents, totalSize));
                    }
                });
            });
        }
    },

    setJoins: function (dbCon, document, callback) {
        var self = this;
        self.joinUserData(dbCon, document, function() {
            self.joinMediaData(dbCon, document, function() {
                if(callback) { callback(); }
            });
        });
    },

    joinUserData: function (dbCon, sourceDoc, callback) {
        var filter = { projection : { password : 0}}, self = this;
        if (sourceDoc && sourceDoc.authorId) {
            self.get(dbCon, constantsService.collections.media, sourceDoc.mediaId, filter, function(userDoc) {
                self._handleUserDataJoin(sourceDoc, userDoc);
                if(callback) { callback(); }
            });
        } else {
            if(callback) { callback(); }
        }
    },

    joinMediaData: function (dbCon, sourceDoc, callback) {
        var filter = { projection : { data : 0}}, self = this;
        if (sourceDoc && sourceDoc.mediaId) {
            self.get(dbCon, constantsService.collections.media, sourceDoc.mediaId, filter, function(mediaDoc) {
                self._handleMediaDataJoin(sourceDoc, mediaDoc);
                if(callback) { callback(); }
            });
        } else {
            if(callback) { callback(); }
        }
    },

    _handleUserDataJoin: function(sourceDoc, userDoc) {
        if (!sourceDoc.create) {
            sourceDoc.create = {
                authorId : sourceDoc['create.authorId']
            };
            delete sourceDoc['create.authorId'];
        }
        if (sourceDoc && sourceDoc.create) {
            sourceDoc.create.author = userDoc;
            delete sourceDoc.create.authorId;
        }
    },

    _handleMediaDataJoin: function(sourceDoc, mediaDoc) {
        sourceDoc.media = mediaDoc;
        delete sourceDoc.mediaId;
    }
};