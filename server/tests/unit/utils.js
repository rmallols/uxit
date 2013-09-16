'use strict';
var routeParams = {
    portal: 'uxitDev',
    page: 'Home'
}, NProgress = {
    configure: function(){},
    start: function(){},
    done: function(){}
};
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

function loadPages($httpBackend, pageService, callback) {
    var mockedResponse = {
        "totalSize": 3,
        "results": [
            {
                "_id": "bla",
                "hasSubPages": true,
                "rows": [
                    { "columns" : [ { "size": 25, "apps" : [] } ] },
                    { "columns" : [
                        { "size": 1, "apps" : [] },
                        { "size": 23, "apps" : [{ "type" : "loginApp"}] },
                        { "size": 1, "apps" : [] }
                    ]},
                    { "columns" : [ { "size": 25, "apps" : [] } ] }
                ],
                "parentPageId": null,
                "position": 0,
                "target": "_blank",
                "text": {
                    "en": {
                        "text": "Home"
                    },
                    "es": {
                        "text": "Inicio"
                    }
                },
                "type": "apps",
                "url": routeParams.page
            },
            {
                "_id": "foo",
                "create": {},
                "externalLinkUrl": "http://www.google.com",
                "hasSubPages": false,
                "rows": [
                    { "columns" : [ { "size": 25, "apps" : [] } ] },
                    { "columns" : [
                        { "size": 1, "apps" : [] },
                        { "size": 11, "apps" : [{ "type" : "menuApp"}] },
                        { "size": 1, "apps" : [] },
                        { "size": 11, "apps" : [{ "type" : "imageApp"}] },
                        { "size": 1, "apps" : [] }
                    ]},
                    { "columns" : [ { "size": 25, "apps" : [] } ] }
                ],
                "parentPageId": null,
                "position": 1,
                "target": "_blank",
                "text": {
                    "en": {
                        "text": "Productos y servicios"
                    }
                },
                "type": "widgets",
                "url": "ProductosYServicios"
            },
            {
                "_id": "51bf4695b0451ce41a000005",
                "hasSubPages": false,
                "parentPageId": "bla",
                "position": 1,
                "text": {
                    "en": {
                        "text": "New pagexsssx2"
                    }
                },
                "url": "NewPagexsssx2",
                "rows": [
                    { "columns" : [ { "size": 25, "apps" : [] } ] },
                    { "columns" : [
                        { "size": 1, "apps" : [] },
                        { "size": 23, "apps" : [{ "type" : "loginApp"}] },
                        { "size": 1, "apps" : [] }
                    ]},
                    { "columns" : [ { "size": 25, "apps" : [] } ] }
                ]
            }
        ]
    };
    $httpBackend.when('GET', '/rest/pages?sort[field]=position&sort[order]=1').respond(mockedResponse);
    pageService.loadPages(function (pages) {
        if (callback) {
            callback(pages);
        }
    });
    $httpBackend.flush();
}

function loadLanguages($httpBackend, i18nService, callback) {
    var mockedResponse = {
        "totalSize": 2,
        "results" : [
            { "code": "en", "text": "english" },
            { "code": "es", "text": "español" }
        ]
    };
    $httpBackend.when('GET', '/rest/languages?').respond(mockedResponse);
    i18nService.loadLanguages(function (languages) {
        if (callback) {
            callback(languages);
        }
    });
    $httpBackend.flush();
}

function loadUserSession($httpBackend, sessionService, isLogged, callback) {
    var mockedLoggedResponse = {
        "_id": "51421324e24e9dc015000001",
        "createAuthorId": "511e68853bcdab0405000001",
        "createDate": "03/14/2013 0:00 +01:00",
        "email": "ricardo.mallols@gmail.com",
        "fullName": "Ricardo Mallols",
        "language": "en",
        "media": { "name": "ricardo_3.jpg" },
        "portalId": "uxitDev",
        "role": 3,
        "tags": ["5228261dadf1c93400000001"]
    },
        mockedNonLoggedResponse = null,
        response = (isLogged) ? mockedLoggedResponse: mockedNonLoggedResponse;
    $httpBackend.when('POST', '/rest/getSession/').respond(response);
    sessionService.loadUserSession(function (userSession) {
        if (callback) {
            callback(userSession);
        }
    });
    $httpBackend.flush();
}

function loadRoles($httpBackend, roleService, callback) {
    var mockedResponse = {
        "totalSize": 4,
        "results": [
            {
                "_id": "51193be27091c10032000003",
                "title": "Guest user",
                "karma": 0,
                "description": "Guest user in portal",
                "code": "guest",
                "create": {}
            },
            {
                "_id": "51193c1c7091c10032000004",
                "title": "Reader user",
                "karma": 1,
                "description": "Reader user in portal",
                "code": "reader",
                "create": {}
            },
            {
                "_id": "51193c247091c10032000005",
                "title": "Creator user",
                "karma": 2,
                "description": "Creator user in portal",
                "code": "creator",
                "create": {}
            },
            {
                "_id": "51193c257091c10032000006",
                "title": "Admin user",
                "karma": 3,
                "description": "Admin user in portal",
                "code": "admin",
                "create": {}
            }
        ]
    };
    $httpBackend.when('GET', '/rest/roles?sort[field]=karma&sort[order]=1').respond(mockedResponse);
    roleService.loadRoles(function (roles) {
        if (callback) {
            callback(roles);
        }
    });
    $httpBackend.flush();
}

function loadAvailableApps($httpBackend, availableAppsService, callback) {
    var mockedResponse = {
        "totalSize": 2,
        "results": [
            {
                "_id": "5118cee97091c10032000001",
                "actions": [
                    "minimize",
                    "maximize",
                    "remove"
                ],
                "avgRating": "2.50",
                "category": "users",
                "createDate": "",
                "defaultTemplate": "view",
                "desc": "This is the login form example, bla bla bla",
                "disabled": false,
                "id": "loginApp",
                "provider": "Test provider",
                "templates": [
                    "view",
                    "edit",
                    "help"
                ],
                "title": "Login form",
                "update": {
                    "date": "2013-04-28T22:00:00.000Z",
                    "authorId": "511e68853bcdab0405000001"
                },
                "version": "0.3",
                "create": {}
            },
            {
                "_id": "511934e87091c10032000002",
                "actions": [
                    "minimize",
                    "maximize",
                    "remove"
                ],
                "avgRating": "4.00",
                "category": "users",
                "comments": [],
                "creationDate": "",
                "defaultModel": {
                    "showTitles": true,
                    "showSearch": true,
                    "pageSize": 10,
                    "skip": 0,
                    "pageActionPos": 2,
                    "sort": {
                        "field": "create.date",
                        "order": "-1"
                    },
                    "searchable": true
                },
                "defaultTemplate": "view",
                "desc": "This is the user list example, asdas dmasd msad as dasndasd asdasdsa",
                "disabled": false,
                "editPanels": [
                    {
                        "title": "Add",
                        "type": "add"
                    }
                ],
                "id": "userListApp",
                "provider": "",
                "rating": "",
                "templates": [
                    "view",
                    "edit",
                    "help"
                ],
                "title": "User List",
                "update": {
                    "date": "2013-04-28T22:00:00.000Z",
                    "authorId": "511e68853bcdab0405000001"
                },
                "version": "0.15-dev",
                "create": {}
            },
            {
                "_id": "50e47006b3b92f3c1a000012",
                "actions": [
                    "minimize",
                    "maximize",
                    "remove"
                ],
                "category": "media",
                "comments": [],
                "creationDate": "",
                "defaultTemplate": "view",
                "desc": "",
                "disabled": false,
                "id": "bannerApp",
                "provider": "",
                "rating": "",
                "templates": [
                    "view",
                    "edit",
                    "help"
                ],
                "title": "Banner",
                "create": {}
            }
        ]
    };
    $httpBackend.when('GET', '/rest/availableApps?sort[field]=category&sort[order]=-1').respond(mockedResponse);
    availableAppsService.loadAvailableApps(function (availableApps) {
        if (callback) {
            callback(availableApps);
        }
    });
    $httpBackend.flush();
}

function compileFn($compile, $scope, $document) {
    var element = angular.element, container;


    function getContainer($document) {
        var body = element($document[0].body),
            containerDiv = element('div.container', body);

        if (containerDiv.length > 0) {
            containerDiv.empty();
        } else {
            containerDiv = element('<div class="container"></div>');
            body.append(containerDiv);
        }

        return containerDiv;
    }

    if ($document) {
        container = getContainer($document);
    }

    return function (html, values) {
        values = values || {};
        var elm = $compile(html)(angular.extend($scope, values));
        $scope.$digest();

        if (container) {
            container.append(elm);
        }

        return elm;
    };
}