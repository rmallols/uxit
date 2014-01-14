'use strict';
function loadLanguages($httpBackend, i18nService, callback) {
    var mockedResponse = {
        "totalSize": 2,
        "results" : [
            { "code": "en", "text": "english", "position": 0 },
            { "code": "es", "text": "español", "position": 1 },
            { "code": "it", "text": "italiano", "position": 2, "inactive": true }
        ]
    };
    $httpBackend.when('GET', 'rest/languages?sort[field]=position&sort[order]=1').respond(mockedResponse);
    i18nService.loadLanguages(function (languages) {
        if (callback) {
            callback(languages);
        }
    });
    $httpBackend.flush();
}