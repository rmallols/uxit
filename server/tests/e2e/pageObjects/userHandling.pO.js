(function() {
    'use strict';

    var execSetup   = require('../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        createUser: function(userName, email, password, role) {
            var fullNameElm, emailElm, birthDateElm, passwordElm, todayDatePickerElm, saveButtonElm, roleElm;
            saveButtonElm       = this._ptor.findElement(this._protractor.By.css(".editBox button.saveIcon"));
            fullNameElm         = this._ptor.findElement(this._protractor.By.input("user.fullName"));
            emailElm            = this._ptor.findElement(this._protractor.By.input("user.email"));
            birthDateElm        = this._ptor.findElement(this._protractor.By.input("user.birthDate"));
            passwordElm         = this._ptor.findElement(this._protractor.By.css("[type='password']"));
            roleElm             = this._ptor.findElement(this._protractor.By.css("select[ng-model='user.role'] option:nth-child(" + (role + 1) + ')'));
            fullNameElm.sendKeys(userName);
            emailElm.sendKeys(email);
            birthDateElm.click();
            todayDatePickerElm  = this._ptor.findElement(this._protractor.By.css(".ui-datepicker a.ui-state-highlight"));
            todayDatePickerElm.click();
            passwordElm.sendKeys(password);
            roleElm.click();
            saveButtonElm.click();
            return this;
        },

        showCreateUserEditBox: function() {
            var createUserButtonElm;
            createUserButtonElm = this._ptor.findElement(this._protractor.By.css("button[create-item-button]"));
            createUserButtonElm.click();
            return this;
        },

        getCreateUserEditBox: function() {
            return  this._ptor.findElement(this._protractor.By.css("[create-users]"));
        },

        getEditUsersList: function() {
            return this._ptor.findElement(this._protractor.By.css('[edit-user-list]'));
        },

        getItemsTitles: function() {
            return this._ptor.findElements(this._protractor.By.css(".item a"));
        },

        getItemsSelectors: function() {
            return this._ptor.findElements(this._protractor.By.css(".item ins"));
        },

        getDeleteItemsButtom: function() {
            return this._ptor.findElement(this._protractor.By.css("button[ng-click='deleteSelected()']"));
        }
    };
})();