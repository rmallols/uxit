(function() {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        portalsAdminPO  = require('../resources/pageObjects/portalsAdmin.pO.js'),
        navigationPO    = require('../resources/pageObjects/navigation.pO.js'),
        mockPortalName  = 'MockPortal', mockUpdatedPortalName = mockPortalName + 'Updated';

    describe('portals admin', function() {

        it('should navigate to the portals admin app', function() {
            navigationPO.navigateTo(execSetup.contextPath + '/menzit/PortalsAdmin');
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(execSetup.contextPath + '/menzit/PortalsAdmin');
            });
        });

        it('should show the portal list from an app', function() {
            var portalsListElm = portalsAdminPO.getPortalsList();
            expect(portalsListElm.isDisplayed()).toBe(true);
        });

        it('should display the create portal edit box', function() {
            var createPortalsLayerElm;
            portalsAdminPO.showCreatePortalEditBox();
            createPortalsLayerElm = portalsAdminPO.getCreatePortalEditBox();
            expect(createPortalsLayerElm.isDisplayed()).toBe(true);
        });

        it('should be able to create a new portal', function() {
            portalsAdminPO.createPortal(mockPortalName);
            portalsAdminPO.getItemsTitles().then(function(itemsTitles) {
                expect(itemsTitles[itemsTitles.length-1].getText()).toBe(mockPortalName);
            });
        });

        it('should be able to reach the newly created portal', function() {
            var newPortalUrl = execSetup.contextPath + '/' + mockPortalName + '/Home';
            navigationPO.navigateTo(newPortalUrl);
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(newPortalUrl);
            });
        });

        it('should display the edit portal edit box whenever the new portal is selected', function() {
            navigationPO.navigateTo(execSetup.contextPath + '/menzit/PortalsAdmin');
            portalsAdminPO.getItemEditElms().then(function(itemsEditElms) {
                var editPortalsLayerElm;
                itemsEditElms[itemsEditElms.length-1].click();
                editPortalsLayerElm = portalsAdminPO.getCreatePortalEditBox();
                expect(editPortalsLayerElm.isDisplayed()).toBe(true);
            });
        });

        it('should rename the newly created portal', function() {
            portalsAdminPO.editPortal(mockUpdatedPortalName);
            portalsAdminPO.getItemsTitles().then(function(itemsTitles) {
                expect(itemsTitles[itemsTitles.length-1].getText()).toBe(mockUpdatedPortalName);
            });
        });

        it('should verify that the old name portal is not longer reachable', function() {
            var oldPortalUrl = execSetup.contextPath + '/' + mockPortalName + '/Home';
            navigationPO.navigateTo(oldPortalUrl);
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).not.toBe(oldPortalUrl);
            });
        });

        it('should be able to reach the newly updated portal', function() {
            var newPortalUrl = execSetup.contextPath + '/' + mockUpdatedPortalName + '/Home';
            navigationPO.navigateTo(newPortalUrl);
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(newPortalUrl);
            });
        });

        it('should be able to delete the newly updated portal', function() {
            navigationPO.navigateTo(execSetup.contextPath + '/menzit/PortalsAdmin');
            portalsAdminPO.getItemSelectorElms().then(function(itemSelectorElms) {
                var deleteSelectedItemButtonElm;
                itemSelectorElms[itemSelectorElms.length-1].click();
                deleteSelectedItemButtonElm = portalsAdminPO.getDeleteItemsButtonElm();
                deleteSelectedItemButtonElm.click();
                portalsAdminPO.getItemsTitles().then(function(itemElms) {
                    expect(itemElms[itemElms.length-1].getText()).not.toBe(mockUpdatedPortalName);
                    navigationPO.navigateTo(execSetup.contextPath + '/menzit/');
                });
            });
        });
    });
})();


