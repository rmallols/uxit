(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('userService', ['$rootScope', 'crudService', '$routeParams', 'constantsService',
    function ($rootScope, crudService, $routeParams, constantsService) {

        var users;

        /**
         *
         *
         */
        function loadUsers(callback) {
            var params = {
                projection  : { password: 0 } //Avoid sending the password to the frontend
            };
            crudService.get(constantsService.collections.users, null, params, function (returnedUsers) {
                users = returnedUsers.results;
                if (callback) { callback(getUsers()); }
            });
        }

        /**
         *
         *
         */
        function getUsers() {
            return users;
        }

        /**
         *
         *
         * @param user
         * @param callback
         */
        function createUser(user, callback) {
            var data;
            if (user.fullName || user.email || user.password) {
                data = {
                    fullName    : user.fullName,
                    email       : user.email,
                    password    : user.password,
                    role        : user.role,
                    language    : user.language,
                    portalId    : $routeParams.portal,
                    tags        : user.tags
                };
                if (user.media && user.media[0] && user.media[0]._id) {
                    data.mediaId = user.media[0]._id;
                }
                crudService.createUser(data, function (newUser) {
                    if (callback) {
                        callback(newUser);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         *
         *
         * @param user
         * @param callback
         */
        function updateUser(user, callback) {
            var data;
            if (user.fullName || user.email || user.password) {
                data = {
                    fullName    : user.fullName,
                    email       : user.email,
                    role        : user.role,
                    language    : user.language,
                    portalId    : $routeParams.portal,
                    tags        : user.tags
                };
                if (user.media && user.media[0] && user.media[0]._id) {
                    data.mediaId = user.media[0]._id;
                }
                if (user.password) { //Update the password, just in case it's being entered by the user
                    data.password = user.password;
                }
                crudService.updateUser(user._id, data, function (updatedUser) {
                    if (callback) {
                        callback(updatedUser);
                    }
                });
            } else if (callback) {
                callback({});
            }
        }

        /**
         *
         *
         * @returns {*}
         */
        function getCurrentUser() {
            return ($rootScope.portal) ? $rootScope.portal.user : null;
        }

        return {
            loadUsers: loadUsers,
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser,
            getCurrentUser: getCurrentUser
        };
    }]);
})(window.COMPONENTS);
