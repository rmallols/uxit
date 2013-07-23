'use strict';
var email               = require("emailjs"),
    crudService         = require('./crudService'),
    constantsService    = require('./dbService');

module.exports = {

    sendEmail: function (body, session, callback) {
        var params = { projection : { email: 1}}, data;
        crudService.get(constantsService.collections.portal, session.user.portalId, params, function (portal) {
            var server  = email.server.connect({
                user        : portal.email.user,
                password    : portal.email.password,
                host        : portal.email.host,
                ssl         : portal.email.ssl
            });
            data = {
                text        : body.text,
                subject     : body.subject,
                from        : '<no-reply> ' + portal.email.user,
                to          : body.to,
                attachment  : [
                    {data: body.text, alternative: true}
                ]
            };
            // send the message and get a callback with an error or details of the message that was sent
            server.send(data, function (err, message) { callback((err) ? null : message); });
        });
    }
};