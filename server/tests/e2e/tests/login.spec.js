(function () {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        loginPO         = require('../resources/pageObjects/login.pO.js'),
        navigationPO    = require('../resources/pageObjects/navigation.pO.js');

    describe('login test', function() {

        it('should execute a fail login if the credentials are not valid, ' +
            'keeping the context on the same login page', function() {
            navigationPO.navigateTo(execSetup.contextPath + '/menzit/login');
            loginPO.login('fail@login.com', 'failPassword');
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(execSetup.contextPath + '/menzit/login?error');
            });
        });

        it('should execute a successful login if the credentials are valid, ' +
        'redirecting to the home page of the portal', function() {
            loginPO.loginAsAdmin();
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(execSetup.contextPath + '/menzit/Home');
            });
        });
    });
})();