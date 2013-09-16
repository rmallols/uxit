(function (describe, beforeEach, inject, it) {
    'use strict';
    describe('sessionService', function () {

        var sessionService, $httpBackend;

        beforeEach(module("components"));
        beforeEach(inject(["$rootScope", "$httpBackend", "sessionService",
        function ($rootScope, $httpBackend_, _sessionService) {
            $httpBackend = $httpBackend_;
            sessionService = _sessionService;
        }]));

        describe('getUserSession', function () {

            it('Should return the current user session', function () {
                loadUserSession($httpBackend, sessionService, true, null);
                var userSession = sessionService.getUserSession();
                expect(userSession._id).toBe('51421324e24e9dc015000001');
                expect(userSession.language).toBe('en');
            });
        });

        describe('addSessionDataToModel', function () {

            it('Should add the session object to the given model', function () {
                var model;
                loadUserSession($httpBackend, sessionService, true, null);
                model = { test: 'model', authorId: 'testAuthorId', create: {} };
                sessionService.addSessionDataToModel(model);
                expect(model.create.author._id).not.toBe(undefined);
                expect(model.create.author._id).toBe(sessionService.getUserSession()._id);
            });

            it('Should delete the authorId information from the given model', function () {
                var model;
                loadUserSession($httpBackend, sessionService, true, null);
                model = { test: 'model', authorId: 'testAuthorId', create: {} };
                sessionService.addSessionDataToModel(model);
                expect(model.create.authorId).toBe(undefined);
            });
        });

        describe('isUserLogged', function () {

            it('Should recognize the user is logged', function () {
                var isLoggedUser;
                loadUserSession($httpBackend, sessionService, true, null);
                isLoggedUser = sessionService.isUserLogged();
                expect(isLoggedUser).toBe(true);
            });

            it('Should recognize the user is not logged', function () {
                var isLoggedUser;
                loadUserSession($httpBackend, sessionService, false, null);
                isLoggedUser = sessionService.isUserLogged();
                expect(isLoggedUser).toBe(false);
            });
        });
    });
})(window.describe, window.beforeEach, window.inject, window.it);