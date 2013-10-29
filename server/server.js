'use strict';
/*EXPRESS SETTINGS*/
var express             = require('express'),
    app                 = express(),
    server              = require('http').createServer(app),
    io                  = require('socket.io').listen(server, { log: false }),
    path                = require('path'),
    /*SERVICES */
    emailService        = require('./emailService'),
    constantsService    = require('./constantsService'),
    liveMessageService  = require("./liveMessageService"),
    dbService           = require("./dbService"),
    collectionService   = require("./collectionService"),
    sessionService      = require("./sessionService"),
    appService          = require("./appService"),
    createService       = require("./crud/createService"),
    userService         = require("./crud/userService"),
    rateService         = require("./crud/rateService"),
    statsService        = require("./crud/statsService"),
    getService          = require("./crud/getService"),
    updateService       = require("./crud/updateService"),
    deleteService       = require("./crud/deleteService"),
    mediaService        = require("./crud/mediaService"),
    downloadService     = require("./crud/downloadService");

//noinspection JSUnresolvedFunction
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: "ch0pSuey" }));

function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.send('You don\'t have permissions to execute this action', 403);
    } else {
        next();
    }
}

function setupDb(req, res, next) {
    dbService.connect(req.params.portalId, function(err, db) {
        req.dbCon = db;
        next();
    });
}

function goToIndex(res) {
    var absPath = path.resolve('../');
    res.sendfile(absPath + '/index.html');
}

app.get('/favicon.ico', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
});

app.post('/:portalId/rest/login', setupDb, function (req, res) {
    sessionService.login(req.dbCon, req.body, req.session, function (success) {
        if (success) {
            res.redirect(req.params.portalId);
        } else {
            res.redirect(req.params.portalId + '/login?error');
        }
    });
});

app.post('/:portalId/rest/getSession', setupDb, function (req, res) {
    sessionService.getSession(req.dbCon, req.session, function (user) {
        res.send(user);
    });
});

app.get('/:portalId/logout', function (req, res) {
    sessionService.logout(req.session, function () {
        res.redirect('/' + req.params.portalId);
    });
});

app.get('/:portalId/rest/databases', checkAuth, function (req, res) {
    dbService.getDatabases(req.session, function(result) {
        res.send(result)
    });
});

app.post('/:portalId/rest/databases/create', checkAuth, function (req, res) {
    dbService.createDatabase(req.body, req.session, function(result) {
        res.send(result);
    });
});

app.put('/:portalId/rest/databases/:id/update', checkAuth, function (req, res) {
    dbService.updateDatabase(req.params.id, req.body, req.session, function(result) {
        res.send(result);
    });
});

app.delete('/:portalId/rest/databases/:id/delete', checkAuth, function (req, res) {
    dbService.deleteDatabase(req.params.id, req.session, function(result) {
        res.send(result)
    });
});

app.post('/:portalId/rest/users/create', checkAuth, setupDb, function (req, res) {
    userService.create(req.dbCon, req.body, req.session, function (newUser) {
        if (!newUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else            { res.send(newUser); }
    });
});

app.post('/:portalId/rest/:collection/create', checkAuth, setupDb, function (req, res) {
    createService.create(req.dbCon, req.params.collection, req.body, req.session, function (newItem) {
        res.send(newItem);
    });
});

app.post('/:portalId/rest/:collection/rate', checkAuth, setupDb, function (req, res) {
    rateService.rate(req.dbCon, req.params.collection, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.get('/:portalId/rest/:collection/getStats', setupDb, function (req, res) {
    statsService.getStats(req.dbCon, req.params.collection, req.query, req.session, function (stats) {
        res.send(stats);
    });
});

app.get('/:portalId/rest/:collection/:id?*', setupDb, function (req, res) {
    getService.get(req.dbCon, req.params.collection, req.params.id, req.query, function (documents) {
        res.send(documents);
    });
});

app.put('/:portalId/rest/users/:id/update', checkAuth, setupDb, function (req, res) {
    userService.update(req.dbCon, req.params.id, req.body, req.session, function (updatedUser) {
        if (!updatedUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else                { res.send(updatedUser); }
    });
});

app.put('/:portalId/rest/:collection/:id/update', checkAuth, setupDb, function (req, res) {
    updateService.update(req.dbCon, req.params.collection, req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.delete('/:portalId/rest/:collection/:id/delete', checkAuth, setupDb, function (req, res) {
    deleteService.delete(req.dbCon, req.params.collection, req.params.id, function (result) {
        res.send(result);
    });
});

app.post('/:portalId/rest/availableApps/deploy', checkAuth, setupDb, function (req, res) {
    appService.deploy(req.dbCon, req.files, req.session, function (result) {
        res.send(result);
    });
});

app.post('/:portalId/rest/availableApps/:id/undeploy', checkAuth, setupDb, function (req, res) {
    appService.undeploy(req.dbCon, req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.post('/:portalId/media/upload/:id?*', checkAuth, setupDb, function (req, res) {
    mediaService.upload(req.dbCon, req.params.id, req.files, req.session, function (images) {
        res.send(images);
    });
});

app.get('/:portalId/media/:id/:name', setupDb, function (req, res) {
    downloadService.download(req.dbCon, req.params.id, function (content) {
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
        }
    });
});

app.post('/:portalId/rest/sendEmail', setupDb, function (req, res) {
    emailService.sendEmail(req.dbCon, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.use('/', express.static('../'));

app.get('/', function (req, res) {
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
});

app.get('/:portalId/login', setupDb, function (req, res) { goToIndex(res); });

app.get('/error', function (req, res) { goToIndex(res); });
console.log("VOLVER A DESCOMENTAR LAS INICIALIZACIONES!")
app.get('/:portalId', setupDb, function (req, res) {
    existsPortal(req.dbCon, req.params.portalId, req.session, function(existsPortal) {
        if(existsPortal) {
            var params = {
                q : { position : 0 },
                projection : { url: 1, type: 1, externalLinkUrl: 1}
            };
            getService.getFirst(req.dbCon, constantsService.collections.pages, params, function (firstPage) {
                if(firstPage) {
                    if (firstPage.type === 'externalLink') { res.redirect(firstPage.externalLinkUrl); }
                    else { res.redirect(req.params.portalId + '/' + firstPage.url); }
                } else {
                    /*collectionService.initializeCollections(req.dbCon, function() { //Initialize their collections
                        console.log("INIT??");
                        goToIndex(res);
                    });*/
                    res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
                }
            });
        } else {
            res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
        }
    });
});

app.get('/:portalId/:pageId', setupDb, function (req, res) {
    existsPortal(req.dbCon, req.params.portalId, req.session, function(existsPortal) {
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
                    else { goToIndex(res); }
                } else {
                    res.redirect('/error?title=errorPage.pageNotFound&targetId=' + req.params.pageId +
                        '&portalId=' + req.params.portalId + '&showPortalHomeButton=true');
                    /*collectionService.initializeCollections(req.dbCon, function() { //Initialize their collections
                        goToIndex(res);
                    });*/
                }
            });
        } else {
            res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
        }
    });
});

function existsPortal(dbCon, portalId, session, callback) {
    dbService.existsDatabase(dbCon, portalId, session, function(result) {
        callback(result);
    });
}

liveMessageService.init(io);

server.listen(3000);
console.log('Listening on port 3000');