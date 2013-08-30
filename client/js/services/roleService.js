(function () {
    'use strict';
    COMPONENTS.factory('roleService', ['$rootScope', 'sessionService', 'crudService', 'constantsService',
    function ($rootScope, sessionService, crudService, constantsService) {

        var keyBasedRoles,    //Store an associative array to make the role validation process as easy as possible
            indexBasedRoles;  //Store the public, index-based role data

        /**
         * Loads all the system roles from the backend
         *
         * @param {function} callback Method to be executed once the roles have been fully retrieved
         */
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
         * Gets all the system roles
         *
         * @returns {array} The array of system roles
         */
        function getRoles() {
            return indexBasedRoles;
        }

        /**
         * Gets a specific role based on its karma
         *
         * @param   {number}    karma The karma identifier of the role that is going to be retrieved
         * @returns {object}    The role with all the information according to the karma selector
         */
        function getRole(karma) {
            return indexBasedRoles[karma];
        }

        /**
         * Determines if the user has guest role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has guest role. False otherwise
         */
        function hasGuestRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.guest].karma : false;
        }

        /**
         * Determines if the user has reader role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has reader role. False otherwise
         */
        function hasReaderRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.reader].karma : false;
        }

        /**
         * Determines if the user has creator role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has creator role. False otherwise
         */
        function hasCreatorRole(user) {
            return (user && keyBasedRoles) ? user.role >= keyBasedRoles[constantsService.roles.creator].karma : false;
        }

        /**
         * Determines if the user has admin role or not
         *
         * @param   {object}    user    The user that is going to be analyzed if he has the role or not
         * @returns {boolean}           True if the user has admin role. False otherwise
         */
        function hasAdminRole(user) {
            return (user && keyBasedRoles && user) ? user.role >= keyBasedRoles[constantsService.roles.admin].karma : false;
        }

        /**
         * Gets the admin style class of the current user
         *
         * @returns {string} A key that identifies that the current user has the admin role. Empty string otherwise
         */
        function getCurrentUserAdminAccessStyleClass() {
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
            getCurrentUserAdminAccessStyleClass : getCurrentUserAdminAccessStyleClass
        };
    }]);
})();
