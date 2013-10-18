'use strict';
/*EXPRESS SETTINGS*/
var express             = require('express'),
    app                 = express(),
    server              = require('http').createServer(app),
    io                  = require('socket.io').listen(server, { log: false }),
    path                = require('path'),
    /*SERVICES */
    crudService         = require('./crudService'),
    emailService        = require('./emailService'),
    constantsService    = require('./constantsService'),
    liveMessageService  = require("./liveMessageService");

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

function goToIndex(res) {
    var absPath = path.resolve('../');
    res.sendfile(absPath + '/index.html');
}

app.post('/:portalId/rest/login', function (req, res) {
    crudService.createDbConnection(req.params.portalId);
    crudService.login(req.body, req.session, function(success) {
        if (success) {
            res.redirect(req.params.portalId);
        } else {
            res.redirect(req.params.portalId + '/login?error');
        }
    });
});

app.post('/rest/getSession', function (req, res) {
    crudService.getSession(req.session, function(user) {
        res.send(user);
    });
});

app.get('/rest/databases', checkAuth, function (req, res) {
    crudService.getDatabases(req.session, function (result) {
        res.send(result)
    });
});

app.post('/rest/databases/create', checkAuth, function (req, res) {
    crudService.createDatabase(req.body, req.session, function (result) {
        res.send(result);
    });
});

app.put('/rest/databases/:id/update', checkAuth, function (req, res) {
    crudService.updateDatabase(req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.delete('/rest/databases/:id/delete', checkAuth, function (req, res) {
    crudService.deleteDatabase(req.params.id, req.session, function (result) {
        res.send(result)
    });
});

app.get('/:portal/logout', function (req, res) {
    crudService.logout(req.session, function() {
        res.redirect('/' + req.params.portal);
    });
});

app.post('/rest/users/create', checkAuth, function (req, res) {
    crudService.createUser(req.body, req.session, function (newUser) {
        if (!newUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else            { res.send(newUser); }
    });
});

app.post('/rest/:collection/create', checkAuth, function (req, res) {
    crudService.create(req.params.collection, req.body, req.session, function (newItem) {
        res.send(newItem);
    });
});

app.post('/rest/:collection/rate', checkAuth, function (req, res) {
    crudService.rate(req.params.collection, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.get('/rest/:collection/getStats', function (req, res) {
    crudService.getStats(req.params.collection, req.query, req.session, function (stats) {
        res.send(stats);
    });
});

app.get('/rest/:collection/:id?*', function (req, res) {
    crudService.get(req.params.collection, req.params.id, req.query, function (documents) {
        res.send(documents);
    });
});

app.put('/rest/users/:id/update', checkAuth, function (req, res) {
    crudService.updateUser(req.params.id, req.body, req.session, function (updatedUser) {
        if (!updatedUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else                { res.send(updatedUser); }
    });
});

app.put('/rest/:collection/:id/update', checkAuth, function (req, res) {
    crudService.update(req.params.collection, req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.delete('/rest/:collection/:id/delete', checkAuth, function (req, res) {
    crudService.delete(req.params.collection, req.params.id, function (result) {
        res.send(result);
    });
});

app.post('/rest/availableApps/deploy', checkAuth, function (req, res) {
    crudService.deployApp(req.files, req.session, function (result) {
        res.send(result);
    });
});

app.post('/rest/availableApps/:id/undeploy', checkAuth, function (req, res) {
    crudService.undeployApp(req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.post('/media/upload/:id?*', checkAuth, function (req, res) {
    crudService.uploadMedia(req.params.id, req.files, req.session, function (images) {
        res.send(images);
    });
});

app.get('/media/:id/:name', function (req, res) {
    crudService.download(req.params.id, function (content) {
        if(content && content[0]) {
            //Try to get the file name from the URL in order to keep the document name once it's going to be downloaded
            // Otherwise, take it from database
            var filename = req.params.name || content.name, buffer;
            //noinspection JSUnresolvedFunction
            res.attachment(filename);
            res.header("Content-Type", content.mime);
            //var buffer = new Buffer(content[0].data, "binary");
            //res.end(buffer, 'binary');
            //noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
            buffer = new Buffer(content[0].data.toString('base64'), "base64")
            res.end(buffer, 'base64');
        }
    });
});

app.post('/rest/sendEmail', function (req, res) {
    emailService.sendEmail(req.body, req.session, function (result) {
        res.send(result);
    });
});

app.get('/initializeApp', checkAuth, function (req, res) {
    crudService.initializeApp(req.session, function (result) {
        res.send(result)
    });
});

app.use('/', express.static('../'));

app.get('/', function (req, res) {
    crudService.getDatabases(req.session, function (databases) {
        var adminDbId;
        if(databases.totalSize > 0) {
            res.redirect('/' + databases.results[0].name);
        } else {
            adminDbId = crudService.getAdminDbId();
            crudService.createDatabase({ name: adminDbId}, req.session, function() {
                res.redirect('/' + adminDbId);
            });
        }
    });
});

app.get('/:portalId/login', function (req, res) { goToIndex(res); });

app.get('/error', function (req, res) { goToIndex(res); });

app.get('/:portalId', function (req, res) {
    existsPortal(req.params.portalId, req.session, function(existsPortal) {
        if(existsPortal) {
            crudService.createDbConnection(req.params.portalId);
            var params = {
                q : { position : 0 },
                projection : { url: 1, type: 1, externalLinkUrl: 1}
            };
            crudService.getFirst(constantsService.collections.pages, params, function (firstPage) {
                if(firstPage) {
                    if (firstPage.type === 'externalLink') { res.redirect(firstPage.externalLinkUrl); }
                    else { res.redirect(req.params.portalId + '/' + firstPage.url); }
                }
            });
        } else {
            res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
        }
    });
});

app.get('/:portalId/:pageId', function (req, res) {
    existsPortal(req.params.portalId, req.session, function(existsPortal) {
        if(existsPortal) {
            crudService.createDbConnection(req.params.portalId);
            var params = {
                q : { url : req.params.pageId },
                projection : { url: 1, type: 1, externalLinkUrl: 1}
            };
            crudService.getFirst(constantsService.collections.pages, params, function (page) {
                if(page) {
                    if (page.type === 'externalLink') {
                        res.redirect(pages.results[0].externalLinkUrl);
                    }
                    else { goToIndex(res); }
                } else {
                    res.redirect('/error?title=errorPage.pageNotFound&targetId=' + req.params.pageId +
                        '&portalId=' + req.params.portalId + '&showPortalHomeButton=true');
                }
            });
        } else {
            res.redirect('/error?title=errorPage.portalNotFound&targetId=' + req.params.portalId);
        }
    });
});

function existsPortal(portalId, session, callback) {
    crudService.existsDatabase(portalId, session, function(exists) {
        callback(exists);
    });
}

liveMessageService.init(io);

server.listen(3000);
console.log('Listening on port 3000');