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