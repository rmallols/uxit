(function () {
    'use strict';
    COMPONENTS.factory('undeployService', ['crudService', function (crudService) {

        /**
         * Undeploys an app from the system
         *
         * @param {object}      appObj      The object that represents the app that is going to be undeployed
         * @param {function}    callback    The function to be executed once the app has been fully undeployed
         */
        function undeploy(appObj, callback) {
            crudService.undeployApp(appObj._id, appObj, function () {
                if (callback) {
                    callback();
                }
            });
        }

        return {
            undeploy: undeploy
        };
    }]);
})();
