'use strict';
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