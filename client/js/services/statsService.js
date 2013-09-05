(function () {
    'use strict';
    COMPONENTS.factory('statsService', ['crudService', function (crudService) {

        function getStats(collection, filter, callback) {
            crudService.getStats(collection, filter, function (stats) {
                if(callback) { callback(stats); }
            });
        }

        return {
            getStats : getStats
        };
    }]);
})();
