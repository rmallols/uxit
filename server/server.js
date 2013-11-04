'use strict';
var express             = require('express'),
    app                 = express(),
    server              = require('http').createServer(app),
    io                  = require('socket.io').listen(server, { log: false }),
    emailService        = require('./emailService'),
    liveMessageService  = require("./liveMessageService"),
    dbService           = require("./dbService"),
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
    downloadService     = require("./crud/downloadService"),
    redirectionService  = require("./redirectionService");

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

app.get('/client/*', function (req, res) {
    redirectionService.bla(req, res);

});

app.get('/favicon.ico', function (req, res) {
    redirectionService.goToFavicon(res);
});

app.post('/:portalId/rest/login', setupDb, function (req, res) {
    sessionService.login(req.dbCon, req.body, req.session, function (success) {
        if (success)    { redirectionService.goToUrl(res, req.params.portalId); }
        else            { redirectionService.goToUrl(res, req.params.portalId + '/login?error'); }
    });
});

app.post('/:portalId/rest/getSession', setupDb, function (req, res) {
    sessionService.getSession(req.dbCon, req.session, function (user) {
        res.send(user);
    });
});

app.get('/:portalId/logout', function (req, res) {
    sessionService.logout(req.session, function () {
        redirectionService.goToUrl(res, '/' + req.params.portalId);
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
        redirectionService.goToMedia(req, res, content);
    });
});

app.post('/:portalId/rest/sendEmail', setupDb, function (req, res) {
    emailService.sendEmail(req.dbCon, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.use('/', express.static('../'));

app.get('/', function (req, res) {
    redirectionService.goToHomePageFromRoot(req, res);
});

app.get('/:portalId/login', setupDb, function (req, res) {
    redirectionService.goToIndex(res);
});

app.get('/error', function (req, res) {
    redirectionService.goToIndex(res);
});

app.get('/:portalId', setupDb, function (req, res) {
    redirectionService.goToHomePageFromPortalRoot(req, res);
});

app.get('/:portalId/:pageId', setupDb, function (req, res) {
    redirectionService.goToPageFromPage(req, res);
});

liveMessageService.init(io);

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log("listening on " + port);
});
