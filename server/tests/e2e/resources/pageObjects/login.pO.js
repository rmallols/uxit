(function() {
    'use strict';

    var execSetup       = require('../../execSetup.js'),
        adminPanelCO    = require('../components/adminPanel.cO.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        login: function(email, password) {
            var emailElm, passwordElm, submitElm;
            emailElm = this._ptor.findElement(this._protractor.By.input("email"));
            passwordElm = this._ptor.findElement(this._protractor.By.input("password"));
            submitElm = this._ptor.findElement(this._protractor.By.css("button.okIcon"));
            emailElm.clear();
            emailElm.sendKeys(email);
            passwordElm.clear();
            passwordElm.sendKeys(password);
            submitElm.click();
            return this;
        },

        loginAsAdmin: function() {
            this.login('admin@menzit.com', 'admin1admin');
            return this;
        },

        logout: function() {
            var logoutButtonElm;
            adminPanelCO.showAdminPanel('.currentUser');
            logoutButtonElm = this._ptor.findElement(this._protractor.By.css("button[ng-click='logout()']"));
            logoutButtonElm.click();
            return this;
        }
    };
})();