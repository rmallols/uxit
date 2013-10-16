(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('crudService', ['$rootScope', 'ajaxService', 'constantsService',
    function ($rootScope, ajaxService, constantsService) {

        /**
         * Executes a create request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be created willl be stored
         * @param {object}      data                The content to be created
         * @param {function}    callback            The function that will be executed once the content has been created
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function create(collection, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + collection + '/create',
                data	: data,
                method  : 'POST',
                success	: function (newItem) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', 'create');
                    }
                    if (callback) {
                        callback(newItem);
                    }
                }
            });
        }

        /**
         * Executes a get request to the backend
         *
         * @param {string}      collection  The name of the collection where the content to be retrieved is stored
         * @param {string}      id          The unique identifier of the content to be retrieved
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the content has been retrieved
         */
        function get(collection, id, data, callback) {
            ajaxService.ajax({
                url     : '/rest/' + collection + ((id) ? '/' + id : ''),
                data	: (data) ? data : {},
                method  : 'GET',
                success	: function (retrievedItem) {
                    if (callback) {
                        callback(retrievedItem);
                    }
                }
            });
        }

        /**
         * Executes an update request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be updated is stored
         * @param {string}      id                  The unique identifier of the content to be updated
         * @param {object}      data                The additional attributes to allow a more fine grained query
         * @param {function}    callback            The function that will be executed once the content has been updated
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function update(collection, id, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + collection + '/' + id + '/update',
                data	: data,
                method  : 'PUT',
                success	: function (updatedItem) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', id);
                    }
                    if (callback) {
                        callback(updatedItem);
                    }
                }
            });
        }

        /**
         * Executes a delete request to the backend
         *
         * @param {string}      collection          The name of the collection where the content to be deleted is stored
         * @param {string}      id                  The unique identifier of the content to be deleted
         * @param {function}    callback            The function that will be executed once the content has been deleted
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function remove(collection, id, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + collection + '/' + id + '/delete',
                method  : 'DELETE',
                success	: function () {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(collection + 'Changed', id);
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        }

        /**
         * Retrieves the databases available in the system
         *
         * @param {function}    callback    The function that will be executed once the databases have been retrieved
         */
        function getDatabases(callback) {
            ajaxService.ajax({
                url     : '/rest/getDatabases',
                method  : 'GET',
                success	: function (databases) {
                    if (callback) {
                        callback(databases);
                    }
                }
            });
        }

        /**
         * Retrieves the stats of a given resource
         *
         * @param {string}      collection  The name of the collection that will serve the stats about
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the stats have been retrieved
         */
        function getStats(collection, data, callback) {
            ajaxService.ajax({
                url     : '/rest/' + collection + '/getStats',
                data	: (data) ? data : {},
                method  : 'GET',
                success	: function (newItem) {
                    if (callback) {
                        callback(newItem);
                    }
                }
            });
        }

        /**
         * Rates a given resource
         *
         * @param {string}      collection  The name of the collection that will be rated
         * @param {object}      data        The additional attributes to allow a more fine grained query
         * @param {function}    callback    The function that will be executed once the rate process is complete
         */
        function rate(collection, data, callback) {
            ajaxService.ajax({
                url     : '/rest/' + collection + '/rate',
                data	: data,
                method  : 'POST',
                success	: function (newItem) {
                    if (callback) {
                        callback(newItem);
                    }
                }
            });
        }

        /**
         * Undeploys an existing app
         *
         * @param {string}      id                  The unique identifier of the app that is going to be undeployed
         * @param {object}      data                The additional attributes to allow a more fine grained query
         * @param {function}    callback            The function that will be executed once the app has been undeployed
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function undeployApp(id, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + constantsService.collections.availableApps + '/' + id + '/undeploy',
                data	: data,
                method  : 'POST',
                success	: function () {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(constantsService.collections.availableApps + 'Undeployed', data.id);
                    }
                    if (callback) {
                        callback({});
                    }
                }
            });
        }

        return {
            create      : create,
            get         : get,
            update      : update,
            delete      : remove,
            getDatabases: getDatabases,
            getStats    : getStats,
            rate        : rate,
            undeployApp : undeployApp
        };
    }]);
})(window.COMPONENTS);