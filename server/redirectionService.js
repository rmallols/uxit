'use strict';
var path                = require('path'),
    fs                  = require('fs'),
    dbService           = require("./dbService"),
    collectionService   = require("./collectionService"),
    constantsService    = require("./constantsService"),
    cssService          = require("./cssService"),
    getService          = require("./crud/getService");

module.exports = {

    goToIndex: function(res) {
        res.send(fs.readFileSync(__dirname + '/../index.html').toString());
    },

    goToUrl: function (res, url) {
        res.redirect(url);
    },

    goToHomePageFromRoot: function(req, res) {
        if(dbService._isHostDb()) {
            dbService.getDatabases(req.session, function (databases) {
                var adminDbId;
                if(databases.totalSize > 0) {
                    res.redirect('/' + databases.results[0].name);
                } else {
                    adminDbId = dbService.getAdminDbId();
                    dbService.createDatabase({ name: adminDbId}, req.session, function() {
                        res.redirect('/' + adminDbId);
                    });
                }
            });
        } else {
            res.redirect('/error?title=errorPage.portalNotSelected');
        }
    },

    goToHomePageFromPortalRoot: function(req, res) {
        function getFirstPage(callback) {
            var params = {
                q : { position : 0 },
                projection : { url: 1, type: 1, externalLinkUrl: 1}
            };
            getService.getFirst(req.dbCon, constantsService.collections.pages, params, function (firstPage) {
                callback(firstPage);
            });
        }

        function getFirstPageLink(firstPage) {
            var firstPageLink;
            if (firstPage.type === 'externalLink') { firstPageLink = firstPage.externalLinkUrl; }
            else { firstPageLink = req.params.portalId + '/' + firstPage.url; }
            return firstPageLink;
        }

        this._existsPortal(req.dbCon, req.params.portalId, req.session, function(existsPortal) {
            if(existsPortal && req.dbCon) {
                getFirstPage(function(firstPage) {
                    if(firstPage) {
                        res.redirect(getFirstPageLink(firstPage));
                    } else {
                        collectionService.initializeCollections(req.dbCon, function() { //Initialize their collections
                            getFirstPage(function(firstPage) {
                                if(firstPage) {
                                    res.redirect(getFirstPageLink(firstPage));
                                } else {
                                    res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
                                }
                            });
                        });
                    }
                });
            } else {
                res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
            }
        });
    },

    goToPageFromPage: function(req, res) {
        var self = this;
        self._existsPortal(req.dbCon, req.params.portalId, req.session, function(existsPortal) {
            if(existsPortal) {
                var params = {
                    q : { url : req.params.pageId },
                    projection : { url: 1, type: 1, externalLinkUrl: 1}
                };
                getService.getFirst(req.dbCon, constantsService.collections.pages, params, function (page) {
                    if(page) {
                        if (page.type === 'externalLink') {
                            res.redirect(pages.results[0].externalLinkUrl);
                        }
                        else { self.goToIndex(res); }
                    } else {
                        res.redirect('/error?title=errorPage.pageNotFound&targetId=' + req.params.pageId +
                            '&portalId=' + req.params.portalId + '&showPortalHomeButton=true');
                    }
                });
            } else {
                res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
            }
        });
    },

    goToFavicon: function(res) {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
    },

    goToMedia: function(req, res, content) {
        if(content && content[0]) {
            //Try to get the file name from the URL in order to keep the document name once it's going to be downloaded
            // Otherwise, take it from database
            var filename = req.params.name || content.name, buffer;
            //noinspection JSUnresolvedFunction
            res.attachment(filename);
            res.header("Content-Type", content.mime);
            //noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
            buffer = new Buffer(content[0].data.toString('base64'), "base64")
            res.end(buffer, 'base64');
        } else {
            res.end(null);
        }
    },

    goToBufferedFile: function(fileName, res, content) {
        res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
        res.setHeader('Content-type', 'application/octet-stream');
        res.send(content);
    },

    goToPortalCss: function (req, res, portalId, forceRefresh) {
        cssService.getPortalCss(req.dbCon, portalId, forceRefresh, function(css) {
            res.send(css);
        });
    },

    _existsPortal: function(dbCon, portalId, session, callback) {
        dbService.existsDatabase(dbCon, portalId, session, function(result) {
            callback(result);
        });
    }
};