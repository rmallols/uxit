(function() {
    'use strict';

    var execSetup = require('../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        show: function() {
            var addAppButtonElm;
            addAppButtonElm = this._ptor.findElement(this._protractor.By.css(".tab.button.addIcon"));
            addAppButtonElm.click();
            return this;
        },

        getRootElm: function() {
            return this._ptor.findElement(this._protractor.By.id('addAppPanel'));
        },

        getAvailableApps: function() {
            return this._ptor.findElements(this._protractor.By.css('[sortable-add-app]'));
        }
    };
})();