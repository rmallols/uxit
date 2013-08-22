(function () {
    'use strict';
    COMPONENTS.factory('roleService', ['$rootScope', 'sessionService', 'crudService', 'constantsService',
    function ($rootScope, sessionService, crudService, constantsService) {

        var keyBasedRoles,    //Store an associative array to make the role validation process as easy as possible
            indexBasedRoles;  //Store the public, index-based role data

        /**
         *
         *
         * @returns {*}
         */
        function getRoles() {
            return indexBasedRoles;
        }

        /**
         *
         *
         * @returns {*}
         */
        function getRole(role) {
            return indexBasedRoles[role];
        }

        function loadRoles(callback) {
            var params = { sort: { field: 'karma', order : '1' }};
            crudService.get(constantsService.collections.roles, null, params, function (serverRoles) {
                var idx, role = {};
                //Initialize the array just once the service is done in order to ease the has*Role actions checks
                keyBasedRoles = [];
                for (idx in serverRoles.results) {
                    if (serverRoles.results.hasOwnProperty(idx)) {
                        role = serverRoles.results[idx];
                        keyBasedRoles[role.code] = {
                            karma       : role.karma,
                            title       : role.title,
                            description : role.description
                        };
                    }
                }
                indexBasedRoles = serverRoles.results;
                if (callback) { callback(getRoles()); }
            });
        }

        /**
         *
         *
         * @param user
         * @returns {boolean}
         */
        function hasGuestRole(user) {
            return (keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.guest].karma : false;
        }

        /**
         *
         *
         * @param user
         * @returns {boolean}
         */
        function hasReaderRole(user) {
            return (keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.reader].karma : false;
        }

        /**
         *
         *
         * @param user
         * @returns {boolean}
         */
        function hasCreatorRole(user) {
            return (keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.creator].karma : false;
        }

        /**
         *
         *
         * @param user
         * @returns {boolean}
         */
        function hasAdminRole(user) {
            return (keyBasedRoles && user) ? user.role >= keyBasedRoles[constantsService.roles.admin].karma : false;
        }

        function getAdminAccessStyleClass() {
            return hasAdminRole(sessionService.getUserSession()) ? 'adminAccess' : '';
        }

        return {
            loadRoles       : loadRoles,
            getRoles        : getRoles,
            getRole         : getRole,
            hasGuestRole    : hasGuestRole,
            hasReaderRole   : hasReaderRole,
            hasCreatorRole  : hasCreatorRole,
            hasAdminRole    : hasAdminRole,
            getAdminAccessStyleClass : getAdminAccessStyleClass
        };
    }]);
})();
