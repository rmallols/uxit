'use strict';
module.exports = {

    cachedUsers : [],
    cachedMedia : [],

    initCachedMedia : function (documents) {
        this.initCache(this.cachedMedia, documents, null);
    },

    initCachedUsers : function (documents) {
        var that = this, userHandlingFn;
        userHandlingFn = function (cachedUser) {
            that.joinMediaData(cachedUser);
        };
        this.initCache(this.cachedUsers, documents, userHandlingFn)
    },

    initCache : function (cachedCollection, documents, documentHandlingFn) {
        if (documents.results && documents.results.length > 0) {
            documents.results.forEach(function (document) {
                if (documentHandlingFn) {
                    documentHandlingFn(document);
                }
                cachedCollection[document._id] = document;
            });
        }
    },

    updateCachedMedia : function (document) {
        this.cachedMedia[document._id] = document;
    },

    setJoins: function (document) {
        this.joinUserData(document);
        this.joinMediaData(document);
    },

    joinUserData: function (document) {
        if (document) {
            //Normalize the authorId data if it comes from a 'stringified' source (i.e. for stats pourposes)
            if (!document.create) {
                document.create = {
                    authorId : document['create.authorId']
                };
                delete document['create.authorId'];
            }
            if (document && document.create) {
                document.create.author = this.cachedUsers[document.create.authorId];
                delete document.create.authorId;
            }
        }
    },

    joinMediaData: function (document) {
        if (document && document.mediaId) {
            document.media = this.cachedMedia[document.mediaId];
            delete document.mediaId;
        }
    }
};