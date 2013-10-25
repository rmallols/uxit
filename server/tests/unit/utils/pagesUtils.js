'use strict';
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
    $httpBackend.when('GET', 'rest/pages?sort[field]=position&sort[order]=1').respond(mockedResponse);
    pageService.loadPages(function (pages) {
        if (callback) {
            callback(pages);
        }
    });
    $httpBackend.flush();
}