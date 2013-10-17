'use strict';
function loadUserSession($httpBackend, sessionService, role, callback) {
    var mockedLoggedResponse = {
            "_id": "51421324e24e9dc015000001",
            "createAuthorId": "511e68853bcdab0405000001",
            "createDate": "03/14/2013 0:00 +01:00",
            "email": "ricardo.mallols@gmail.com",
            "fullName": "Ricardo Mallols",
            "language": "en",
            "media": { "name": "ricardo_3.jpg" },
            "portalId": "testPortal",
            "role": role,
            "tags": ["5228261dadf1c93400000001"]
        },
        mockedNonLoggedResponse = null,
        response = (role) ? mockedLoggedResponse: mockedNonLoggedResponse;
    $httpBackend.when('POST', '/rest/getSession/').respond(response);
    sessionService.loadUserSession(function (userSession) {
        if (callback) {
            callback(userSession);
        }
    });
    $httpBackend.flush();
}