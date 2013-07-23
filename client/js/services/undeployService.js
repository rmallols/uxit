(function () {
    'use strict';
    COMPONENTS.factory('undeployService', ['crudService', function (crudService) {

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
