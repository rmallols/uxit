(function() {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        addAppPanelPO   = require('../pageObjects/addAppPanel.pO.js');

    describe('add app panel', function() {

        it('should display the list of available apps', function() {
            var addAppPanelElm = addAppPanelPO.getRootElm();
            expect(addAppPanelElm.isDisplayed()).toBe(true);
        });

        it('should display the proper amount of available apps', function() {
            var availableAppsElm;
            availableAppsElm = addAppPanelPO.getAvailableApps();
            availableAppsElm.then(function(availableAppsElms) {
                expect(availableAppsElms.length).toEqual(18);
            });
        });
    });
})();


