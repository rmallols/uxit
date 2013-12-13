(function () {
    'use strict';

    var execSetup = require('../execSetup.js');

    describe('quit', function () {
        it('afterAll', function () {
            // This is a sad hack to do any shutdown of the server.
            // TODO(juliemr): Add afterall functionality to jasmine-node
            execSetup.quit();
        });
    });
})();
