(function() {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        addAppPanelCO   = require('../resources/components/addAppPanel.cO.js');

    describe('add app panel', function() {

        it('should display the list of available apps', function() {
            var addAppPanelElm = addAppPanelCO.getRootElm();
            expect(addAppPanelElm.isDisplayed()).toBe(true);
        });

        it('should display the proper amount of available apps', function() {
            var availableAppsElm;
            availableAppsElm = addAppPanelCO.getAvailableApps();
            availableAppsElm.then(function(availableAppsElms) {
                expect(availableAppsElms.length).toEqual(18);
            });
        });
    });
})();


