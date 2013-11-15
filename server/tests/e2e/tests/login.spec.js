var execSetup = require('../execSetup.js');

describe('login test', function() {

    var ptor;
    beforeEach(function() {
        ptor = execSetup.getPtor();
    });

    it('should execute a fail login if the credentials are not valid, ' +
        'keeping the context on the same login page', function() {
        var emailElm, passwordElm, submitElm;
        ptor.get('http://localhost:3000/menzit/login');
        emailElm = ptor.findElement(protractor.By.input("email"));
        passwordElm = ptor.findElement(protractor.By.input("password"));
        submitElm = ptor.findElement(protractor.By.css("button.okIcon"));
        emailElm.clear();
        emailElm.sendKeys('fail@login.com');
        passwordElm.clear();
        passwordElm.sendKeys('failLogin');
        submitElm.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toBe('http://localhost:3000/menzit/login?error');
        })
    });

    it('should execute a successful login if the credentials are valid, ' +
    'redirecting to the home page of the portal', function() {
        var emailElm, passwordElm, submitElm;
        emailElm = ptor.findElement(protractor.By.input("email"));
        passwordElm = ptor.findElement(protractor.By.input("password"));
        submitElm = ptor.findElement(protractor.By.css("button.okIcon"));
        emailElm.clear();
        emailElm.sendKeys('admin@menzit.com');
        passwordElm.clear();
        passwordElm.sendKeys('admin1admin');
        submitElm.click();
        ptor.getCurrentUrl().then(function(url) {
            expect(url).toBe('http://localhost:3000/menzit/Home');
        })
    });
});
