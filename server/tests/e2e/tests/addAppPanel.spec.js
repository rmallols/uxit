var execSetup = require('../execSetup.js');

describe('add app panel', function() {

    var ptor;
    beforeEach(function() {
        ptor = execSetup.getPtor();
    });

    it('should display the list of available apps', function() {
        var addAppButtonElm, addAppPanelElm;
        addAppButtonElm = ptor.findElement(protractor.By.css(".tab.button.addIcon"));
        addAppButtonElm.click();
        addAppPanelElm = ptor.findElement(protractor.By.id('addAppPanel'));
        expect(addAppPanelElm.isDisplayed()).toBe(true);
    });

    it('should display the proper amount of available apps', function() {
        var availableAppsElm;
        availableAppsElm = ptor.findElements(protractor.By.css('[sortable-add-app]'));
        availableAppsElm.then(function(availableAppsElms) {
            expect(availableAppsElms.length).toEqual(18);
        });
    });
});
