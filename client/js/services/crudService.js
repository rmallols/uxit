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
         * Executes a user create request to the backend
         * It needs special handling compared with the generic 'create' method as it requires password crypting
         *
         * @param {object}      data                The data of the user that is going to be created
         * @param {function}    callback            The function that will be executed once the user has been created
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function createUser(data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + constantsService.collections.users + '/createUser',
                data	: data,
                method  : 'POST',
                success	: function (newItem) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(constantsService.collections.users + 'Changed', newItem._id);
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
         * Executes a user update request to the backend
         * It needs special handling compared with the generic 'update' method as it could require password crypting
         *
         * @param {string}      id                  The unique identifier of the user to be updated
         * @param {object}      data                The additional attributes to allow a more fine grained query
         * @param {function}    callback            The function that will be executed once the user has been updated
         * @param {boolean}     blockBroadcastEvent The mutex that blocks propagating the broadcast event
         */
        function updateUser(id, data, callback, blockBroadcastEvent) {
            ajaxService.ajax({
                url     : '/rest/' + constantsService.collections.users + '/' + id + '/updateUser',
                data	: data,
                method  : 'PUT',
                success	: function (updatedUser) {
                    if (!blockBroadcastEvent) {
                        $rootScope.$broadcast(constantsService.collections.users + 'Changed', id);
                    }
                    if (callback) {
                        callback(updatedUser);
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
            createUser  : createUser,
            get         : get,
            update      : update,
            updateUser  : updateUser,
            delete      : remove,
            getStats    : getStats,
            rate        : rate,
            undeployApp : undeployApp
        };
    }]);
})(window.COMPONENTS);