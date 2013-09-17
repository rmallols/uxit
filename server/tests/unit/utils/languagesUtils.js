'use strict';
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