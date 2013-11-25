(function() {
    'use strict';

    var execSetup       = require('../execSetup.js'),
        userHandlingPO  = require('../pageObjects/userHandling.pO.js'),
        globalMsgPO     = require('../pageObjects/globalMsg.pO.js'),
        navigationPO    = require('../pageObjects/navigation.pO.js'),
        loginPO         = require('../pageObjects/login.pO.js'),
        mockUserName    = 'Mock user';

    describe('user handling', function() {

        it('should show the user list from the admin panel', function() {
            var editUsersListPanelElm;
            userHandlingPO.showAdminPanel('.userIcon');
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
            expect(globalMsgPO.isVisible()).toBe(false);
            userHandlingPO.createUser(mockUserName, 'mock@user.com', 'mockPassword7', 3);
            expect(globalMsgPO.isVisible()).toBe(true);
        });

        it('should be able to logout, redirecting to the home page of the portal', function() {
            userHandlingPO.logout();
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe('http://localhost:3000/menzit/Home');
            });
        });

        it('should be able to login with the newly created user', function() {
            navigationPO.navigateTo('http://localhost:3000/menzit/login');
            loginPO.login('mock@user.com', 'mockPassword7');
            navigationPO.getCurrentUrl().then(function(url) {
                expect(url).toBe('http://localhost:3000/menzit/Home');
            });
        });

        it('should delete the current user', function() {
            var itemElm, deleteSelectedItemButtonElm;
            userHandlingPO.showAdminPanel('.userIcon');
            userHandlingPO.getItemsSelectors().then(function(itemsSelectors) {
                itemsSelectors[itemsSelectors.length-1].click();
                deleteSelectedItemButtonElm = userHandlingPO.getDeleteItemsButtom();
                deleteSelectedItemButtonElm.click();
                itemElm =  userHandlingPO.getItemsTitles();
                itemElm.then(function(itemElms) {
                    expect(itemElms[itemElms.length-1].getText()).not.toBe(mockUserName);
                });
            });
        });
    });
})();
