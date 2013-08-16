'use strict';
var utilsService = require("./utilsService");
module.exports = {

    connect: function () {
        var databaseUrl = "uxit";
        return require("mongojs").connect(databaseUrl)
    },

    initializePortal: function (db, session, callback) {
        var data = {
            "id"    : "uxitDev",
            "title"	: "UXIT dev",
            "desc"	: "This is the description of the portal!",
            "styles": {
                "background": ""
            },
            "app": {
                "showTitle" : false,
                "showComments" : false,
                "styles" : {
                    "background": "#fff"
                }
            },
            "template": {
                "rows": [
                    {
                        "template": true,
                        "columns": [
                            { "size": 25, "apps": [] }
                        ]
                    },
                    {
                        "columns": [
                            {
                                "size": 25, "rows": []
                            }
                        ]
                    },
                    {
                        "template": true,
                        "columns": [
                            { "size": 25, "apps": [] }
                        ]
                    }
                ]
            },
            "pages"	:
                [
                    {
                        "page": "Home",
                        "text": "Inicio",
                        "rows": [
                            {
                                "columns": [
                                    {
                                        "size": 25,
                                        "apps": [
                                            {
                                                "type": "login"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
        utilsService.addCreateSignature(data, session);
        db.portal.save([data],
            function (err, saved) {
                if (err || !saved) {
                    console.log("portal NOT saved", err);
                } else {
                    console.log("portal saved");
                }
            });
        callback({});
    }
};