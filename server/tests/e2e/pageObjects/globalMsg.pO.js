(function() {
    'use strict';

    var execSetup   = require('../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        isVisible: function() {
            var globalMsgElm = this._ptor.findElement(this._protractor.By.id("globalMsg"));
            return globalMsgElm.isDisplayed();
        }
    };
})();