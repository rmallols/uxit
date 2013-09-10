(function (COMPONENTS) {
    'use strict';
    COMPONENTS.factory('userService', ['portalService', 'sessionService', 'crudService', '$routeParams', 'constantsService',
    function (portalService, sessionService, crudService, $routeParams, constantsService) {

        var users;

        /**
         * Loads all the available users in the system
         *
         * @param {function} callback The function to be executed once all the users have been fully loaded
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
         * Gets the previously loaded users
         *
         * @returns {array} The array with all the previously loaded users
         */
        function getUsers() {
            return users;
        }

        /**
         * Creates a new user
         *
         * @param {object}      user        The object that stores the new user information
         * @param {function}    callback    The function to be executed once the user has been fully created
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
                if (user.media && user.media._id) {
                    data.mediaId = user.media._id;
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
         * Updates an existing user
         *
         * @param {object}      user        The object that stores the existing user information
         * @param {function}    callback    The function to be executed once the user has been fully updated
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
                if (user.media && user.media._id) {
                    data.mediaId = user.media._id;
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

        return {
            loadUsers: loadUsers,
            getUsers: getUsers,
            createUser: createUser,
            updateUser: updateUser
        };
    }]);
})(window.COMPONENTS);
