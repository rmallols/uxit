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

app.post('/rest/login', function (req, res) {
    crudService.login(req.body, req.session, function(success) {
        if (success) {
            res.redirect('/' + req.session.user.portalId); //Redirect to user default portal
        } else {
            res.redirect('/login?error');
        }
    });
});

app.post('/rest/getSession', function (req, res) {
    crudService.getSession(req.session, function(user) {
        res.send(user);
    });
});

app.get('/logout', function (req, res) {
    crudService.logout(req.session, function() {
        res.redirect('/login');
    });
});

app.get('/:portal/logout', function (req, res) {
    crudService.logout(req.session, function() {
        res.redirect('/' + req.params.portal);
    });
});

app.post('/rest/:collection/create', checkAuth, function (req, res) {
    crudService.create(req.params.collection, req.body, req.session, function (newItem) {
        res.send(newItem);
    });
});

app.post('/rest/:collection/createUser', checkAuth, function (req, res) {
    crudService.createUser(req.params.collection, req.body, req.session, function (newUser) {
        if (!newUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else            { res.send(newUser); }
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

app.put('/rest/:collection/:id/update', checkAuth, function (req, res) {
    crudService.update(req.params.collection, req.params.id, req.body, req.session, function (result) {
        res.send(result);
    });
});

app.put('/rest/:collection/:id/updateUser', checkAuth, function (req, res) {
    crudService.updateUser(req.params.collection, req.params.id, req.body, req.session, function (updatedUser) {
        if (!updatedUser)   { res.send('The e-mail address already exists. Please select a new one', 403); }
        else                { res.send(updatedUser); }
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
        //Try to get the file name from the URL in order to keep the document name once it's going to be downloaded
        // Otherwise, take it from database
        var filename = req.params.name || content.name, buffer;
        //noinspection JSUnresolvedFunction
        res.attachment(filename);
        res.header("Content-Type", content.mime);
        //var buffer = new Buffer(content[0].data, "binary");
        //res.end(buffer, 'binary');
        buffer = new Buffer(content[0].data.toString('base64'), "base64")
        res.end(buffer, 'base64');
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

app.get('/login', function (req, res) {
    var absPath = path.resolve('../');
    res.sendfile(absPath + '/index.html');
});

app.get('/:portalId', function (req, res) {
    var params = {
        q : { position : 0 },
        projection : { url: 1, type: 1, externalLinkUrl: 1},
        sort : { field: 'position', order : '1' }
    };
    crudService.getFirst(constantsService.collections.pages, params, function (firstPage) {
        if(firstPage) {
            if (firstPage.type === 'externalLink') { res.redirect(firstPage.externalLinkUrl); }
            else { res.redirect(req.params.portalId + '/' + firstPage.url); }
        } else {
            res.redirect(req.params.portalId + '/PAGE_NOT_FOUND');
        }
    });
});

app.get('/:portalId/:pageId', function (req, res) {
    var absPath = path.resolve('../'),
        params = {
            q : { url : req.params.pageId },
            projection : { url: 1, type: 1, externalLinkUrl: 1},
            sort : { field: 'position', order : '1' }
        };
    crudService.get(constantsService.collections.pages, null, params, function (pages) {
        if (pages.results.length > 0 && pages.results[0].type === 'externalLink') {
            res.redirect(pages.results[0].externalLinkUrl);
        }
        else { res.sendfile(absPath + '/index.html'); }
    });
});

liveMessageService.init(io);

server.listen(3000);
console.log('Listening on port 3000');