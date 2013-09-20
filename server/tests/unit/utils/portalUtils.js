'use strict';
function loadPortal($httpBackend, portalService, callback) {
    var mockedResponse = {
        "id"    : routeParams.portal,
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
    $httpBackend.when('GET', '/rest/portal/' + routeParams.portal + '?').respond(mockedResponse);
    portalService.loadPortal(routeParams.portal, routeParams.page, function (portal) {
        if (callback) {
            callback(portal);
        }
    });
    $httpBackend.flush();
}