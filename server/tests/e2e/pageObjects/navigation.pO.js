(function() {
    'use strict';

    var execSetup   = require('../execSetup.js');

    module.exports = {

        _ptor: execSetup.getPtor(),
        _protractor: execSetup.getProtractor(),

        getCurrentUrl: function() {
            return this._ptor.getCurrentUrl();
        },

        navigateTo: function(url) {
            this._ptor.get(url);
            return this;
        }
    };
})();