(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('dbService', ['crudService', function (crudService) {

        /**
         * Gets all the databases available in the system
         *
         */
        function getDatabases(callback) {
            crudService.getDatabases(function(databases) {
                if(callback) {
                    callback(databases);
                }
            })
        }

        /**
         * Generates a database selector that will execute an insesitive search based on the given selector
         *
         * @param {*}                               selector    The matching object that will be used as a filter
         * @param {boolean}                         exact       True if the selector is exact. False if it's approximate
         * @returns {{$regex: *, $options: string}}             The normalized database selector to perform an insensitive  query
         */
        function getInsensitiveSelector(selector, exact) {
            var regexSelector = (exact) ? '^' + selector + '$' : selector;
            return { $regex: regexSelector, $options: 'i' };
        }

        /**
         * Generates a database selector that will execute an inexact search based on the given selector
         *
         * @param {*}                               selector    The matching object that will be used as a filter
         * @returns {{$regex: *, $options: string}}             The normalized database selector to perform an inexact  query
         */
        function getInexactSelector(selector) {
            return { $regex: '^.*' + selector + '.*', $options: 'i' };
        }

        return {
            getDatabases: getDatabases,
            getInsensitiveSelector: getInsensitiveSelector,
            getInexactSelector: getInexactSelector
        };
    }]);
})(window.COMPONENTS);
