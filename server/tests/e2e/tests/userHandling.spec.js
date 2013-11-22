var execSetup = require('../execSetup.js');

describe('user handling', function() {

    var ptor;
    beforeEach(function() {
        ptor = execSetup.getPtor();
    });

    it('should show the user list from the admin panel', function() {
        var usersButtonAdminPanelElm, editUserListPanelElm;
        usersButtonAdminPanelElm = ptor.findElement(protractor.By.css(".tab.button.userIcon"));
        usersButtonAdminPanelElm.click();
        editUserListPanelElm = ptor.findElement(protractor.By.css('[edit-user-list]'));
        expect(editUserListPanelElm.isDisplayed()).toBe(true);
    });

    it('should display the create user edit box', function() {
        var createUserButtonElm, createUsersLayerElm;
        createUserButtonElm = ptor.findElement(protractor.By.css("button[create-item-button]"));
        createUserButtonElm.click();
        createUsersLayerElm = ptor.findElement(protractor.By.css("[create-users]"));
        expect(createUsersLayerElm.isDisplayed()).toBe(true);
    });

    it('should be able to create a new user', function() {
        var userName = 'Mock User', itemElm;
        addUser(userName, 'mock@user.com', 'mockPassword7');
        itemElm = ptor.findElements(protractor.By.css(".item a"));
        itemElm.then(function(itemElms) {
            expect(itemElms[itemElms.length-1].getText()).toBe(userName);
        });
    });

    it('should not be able to create a second user with the same email as the previous one', function() {
        var userName = 'Mock User', itemElm;
        addUser(userName, 'mock@user.com', 'mockPassword7');
        //CHECK HERE IF THE GLOBAL MESSAGE APPEARS!!
    });

    function addUser(userName, email, password) {
        var fullNameElm, emailElm, birthDateElm, passwordElm, todayDatePickerElm, saveButtonElm;
        saveButtonElm       = ptor.findElement(protractor.By.css(".editBox button.saveIcon"));
        fullNameElm         = ptor.findElement(protractor.By.input("user.fullName"));
        emailElm            = ptor.findElement(protractor.By.input("user.email"));
        birthDateElm        = ptor.findElement(protractor.By.input("user.birthDate"));
        passwordElm         = ptor.findElement(protractor.By.css("[type='password']"));
        fullNameElm.sendKeys(userName);
        emailElm.sendKeys(email);
        birthDateElm.click();
        todayDatePickerElm  = ptor.findElement(protractor.By.css(".ui-datepicker a.ui-state-highlight"));
        todayDatePickerElm.click();
        passwordElm.sendKeys(password);
        saveButtonElm.click();
    }
});
