(function () {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        loginPO         = require('../pageObjects/login.pO.js'),
        navigationPO    = require('../pageObjects/navigation.pO.js');

    describe('login test', function() {

        it('should execute a fail login if the credentials are not valid, ' +
            'keeping the context on the same login page', function() {
            navigationPO.navigateTo('http://localhost:3000/menzit/login');
            loginPO.login('fail@login.com', 'failPassword');
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe('http://localhost:3000/menzit/login?error');
            });
        });

        it('should execute a successful login if the credentials are valid, ' +
        'redirecting to the home page of the portal', function() {
            loginPO.loginAsAdmin();
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe('http://localhost:3000/menzit/Home');
            });
        });
    });
})();