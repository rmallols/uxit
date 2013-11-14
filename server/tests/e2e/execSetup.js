var webdriver = require('../../../node_modules/protractor/node_modules/selenium-webdriver');
var protractor = require('../../../node_modules/protractor/lib/protractor.js');
require('../../../node_modules/protractor/jasminewd');

var driver = new webdriver.Builder().
    usingServer('http://localhost:4444/wd/hub').
    withCapabilities(webdriver.Capabilities.chrome()).build(),
    ptor;
driver.manage().timeouts().setScriptTimeout(30000);
ptor = protractor.wrapDriver(driver);

module.exports = {

    getPtor: function() {
        return ptor;
    }
}