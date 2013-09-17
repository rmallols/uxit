'use strict';
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