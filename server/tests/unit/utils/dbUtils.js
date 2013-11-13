'use strict';
function loadDatabases($httpBackend, dbService, callback) {
    var mockedResponse = {
        "totalSize": 2,
        "results": [
            {
                "name": "menzitDev"
            },
            {
                "name": "menzitTest"
            }
        ]
    };
    $httpBackend.when('GET', 'rest/databases?').respond(mockedResponse);
    dbService.loadDatabases(function (databases) {
        if (callback) {
            callback(databases);
        }
    });
    $httpBackend.flush();
}