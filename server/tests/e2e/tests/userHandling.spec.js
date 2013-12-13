(function() {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        adminPanelCO    = require('../resources/components/adminPanel.cO.js'),
        userHandlingPO  = require('../resources/pageObjects/userHandling.pO.js'),
        globalMsgCO     = require('../resources/components/globalMsg.cO.js'),
        navigationPO    = require('../resources/pageObjects/navigation.pO.js'),
        loginPO         = require('../resources/pageObjects/login.pO.js'),
        mockUserName    = 'Mock user';

    describe('user handling', function() {

        it('should show the user list from the admin panel', function() {
            var editUsersListPanelElm;
            adminPanelCO.showAdminPanel('.userIcon');
            editUsersListPanelElm = userHandlingPO.getEditUsersList();
            expect(editUsersListPanelElm.isDisplayed()).toBe(true);
        });

        it('should display the create user edit box', function() {
            var createUsersLayerElm;
            userHandlingPO.showCreateUserEditBox();
            createUsersLayerElm = userHandlingPO.getCreateUserEditBox();
            expect(createUsersLayerElm.isDisplayed()).toBe(true);
        });

        it('should be able to create a new user', function() {
            userHandlingPO.createUser(mockUserName, 'mock@user.com', 'mockPassword7', 3);
            userHandlingPO.getItemsTitles().then(function(itemsTitles) {
                expect(itemsTitles[itemsTitles.length-1].getText()).toBe(mockUserName);
            });
        });

        it('should not be able to create a second user with the same email as the previous one', function() {
            userHandlingPO.showCreateUserEditBox();
            expect(globalMsgCO.isVisible()).toBe(false);
            userHandlingPO.createUser(mockUserName, 'mock@user.com', 'mockPassword7', 3);
            expect(globalMsgCO.isVisible()).toBe(true);
        });

        it('should be able to logout, redirecting to the home page of the portal', function() {
            loginPO.logout();
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(execSetup.contextPath + '/menzit/Home');
            });
        });

        it('should be able to login with the newly created user', function() {
            navigationPO.navigateTo(execSetup.contextPath + '/menzit/login');
            loginPO.login('mock@user.com', 'mockPassword7');
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe(execSetup.contextPath + '/menzit/Home');
            });
        });

        it('should delete the current user', function() {
            var itemElm, deleteSelectedItemButtonElm;
            adminPanelCO.showAdminPanel('.userIcon');
            userHandlingPO.getItemSelectorElms().then(function(itemsSelectors) {
                itemsSelectors[itemsSelectors.length-1].click();
                deleteSelectedItemButtonElm = userHandlingPO.getDeleteItemsButtonElm();
                deleteSelectedItemButtonElm.click();
                itemElm =  userHandlingPO.getItemsTitles();
                itemElm.then(function(itemElms) {
                    expect(itemElms[itemElms.length-1].getText()).not.toBe(mockUserName);
                    loginPO.logout();
                    loginPO.loginAsAdmin();
                });
            });
        });
    });
})();
