(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('dbService', ['crudService', function (crudService) {

        var databasesKey = 'databases';

        /**
         * Retrieves the databases available in the system
         *
         * @param {function} callback The function that will be executed once the databases have been retrieved
         */
        function getDatabases(callback) {
            crudService.get(databasesKey, null, null, function(databases) {
                if(callback) {
                    callback(databases);
                }
            })
        }

        /**
         * Updates the database available in the system
         *
         * @param {string}      databaseId  The id of the database that is going to be deleted
         * @param {string}      data        The info of the database that is going to be updated
         * @param {function}    callback    The function that will be executed once the database have been updated
         */
        function updateDatabase(databaseId, data, callback) {
            crudService.update(databasesKey, databaseId, data, function(result) {
                if(callback) {
                    callback(result);
                }
            })
        }

        /**
         * Physically deletes a given database
         *
         * @param {string}      databaseId  The id of the database that is going to be deleted
         * @param {function}    callback    The function that will be executed once the database have been deleted
         */
        function deleteDatabase(databaseId, callback) {
            crudService.delete(databasesKey, databaseId, function(result) {
                if(callback) {
                    callback(result);
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
            updateDatabase: updateDatabase,
            deleteDatabase: deleteDatabase,
            getInsensitiveSelector: getInsensitiveSelector,
            getInexactSelector: getInexactSelector
        };
    }]);
})(window.COMPONENTS);
