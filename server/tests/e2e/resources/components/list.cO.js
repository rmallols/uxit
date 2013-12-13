(function() {
    'use strict';

    var execSetup   = require('../../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        showCreateEditBox: function() {
            var createButtonElm;
            createButtonElm = this._ptor.findElement(this._protractor.By.css("button[create-item-button]"));
            createButtonElm.click();
            return this;
        },

        getDeleteItemsButtonElm: function() {
            return this._ptor.findElement(this._protractor.By.css("button[ng-click='deleteSelected()']"));
        },

        getItemsTitles: function(titleSelector) {
            return this._ptor.findElements(this._protractor.By.css(".item " + titleSelector));
        },

        getItemEditElms: function() {
            return this._ptor.findElements(this._protractor.By.css(".item .text"));
        },

        getItemSelectorElms: function() {
            return this._ptor.findElements(this._protractor.By.css(".item ins"));
        }
    };
})();