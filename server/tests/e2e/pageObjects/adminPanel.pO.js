(function() {
    'use strict';

    var execSetup   = require('../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        showAdminPanel: function(adminPanelButtonId) {
            var buttonAdminPanelElm;
            buttonAdminPanelElm = this._ptor.findElement(this._protractor.By.css(".tabButton" + adminPanelButtonId));
            buttonAdminPanelElm.click();
            return this;
        }
    };
})();