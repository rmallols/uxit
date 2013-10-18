'use strict';
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
            },
            {
                "_id": "51193c257091c10032000007",
                "title": "Super admin user",
                "karma": 4,
                "description": "Admin user in all the portals",
                "code": "superAdmin",
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