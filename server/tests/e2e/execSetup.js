(function() {
    var webdriver = require('../../../node_modules/protractor/node_modules/selenium-webdriver'),
        protractor = require('../../../node_modules/protractor/lib/protractor.js'),
        driver, ptor;

    require('../../../node_modules/protractor/jasminewd');

    driver =    new webdriver.Builder()
                .usingServer('http://localhost:4444/wd/hub')
                .withCapabilities(webdriver.Capabilities.chrome()).build();

    driver.manage().timeouts().setScriptTimeout(60000);
    ptor = protractor.wrapDriver(driver);

    module.exports = {

        contextPath: 'http://localhost:3000', //Avoid the final '/'

        getPtor: function() {
            return ptor;
        },

        getProtractor: function() {
            return protractor;
        },

        quit: function() {
            driver.quit();
        }
    };
})();