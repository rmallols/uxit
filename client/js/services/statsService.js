(function () {
    'use strict';
    COMPONENTS.factory('statsService', ['crudService', function (crudService) {

        /**
         * Loads the stats of a given collection
         *
         * @param {string}      collection  The target collection where the stats are going to be retrieved from
         * @param {object}      filter      The settings to execute a fine grained query
         * @param {function}    callback    The function to execute once the stats have been fully loaded
         */
        function loadStats(collection, filter, callback) {
            crudService.getStats(collection, filter, function (stats) {
                if(callback) { callback(stats); }
            });
        }

        return {
            loadStats : loadStats
        };
    }]);
})();
