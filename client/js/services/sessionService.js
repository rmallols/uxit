(function () {
    'use strict';
    COMPONENTS.factory('sessionService', ['$rootScope', '$routeParams', 'ajaxService', 'objectService',
    function ($rootScope, $routeParams, ajaxService, objectService) {

        var userSession;

        /**
         * Loads the currently logged user session
         *
         * @param {function} callback The function to execute once the session has been fully loaded
         */
        function loadUserSession(callback) {
            ajaxService.ajax({
                url     : 'rest/getSession/',
                method  : 'POST',
                data    : {},
                success	: function (loadedUserSession) {
                    setUserSession(loadedUserSession);
                    if (callback) {
                        callback(getUserSession());
                    }
                }
            });
        }

        /**
         * Gets the session of the currently logged user
         *
         * @returns {object} The info of the session of the currently logged user
         */
        function getUserSession() {
            return userSession;
        }

        /**
         * Attachs session information to a given model object
         *
         * @param {object} model The object where the session data is going to be attached
         */
        function addSessionDataToModel(model) {
            model.create.author = getUserSession();
            delete model.create.authorId;
        }

        /**
         * Determines if the current user is logged or not
         *
         * @returns {boolean} True if the current user is logged. False otherwise
         */
        function isUserLogged() {
            var userSession = getUserSession();
            return !objectService.isEmpty(userSession);
        }

        /**
         * Closes the session of the current user
         */
        function logout() {
            window.open('logout', '_self');
        }

        /** Private methods **/
        function setUserSession(loadedUserSession) {
            if (loadedUserSession) {
                userSession = loadedUserSession;
            } else {
                userSession = null;
            }
        }
        /** End of private methods **/

        return {
            //login: login,
            loadUserSession         : loadUserSession,
            getUserSession          : getUserSession,
            addSessionDataToModel   : addSessionDataToModel,
            isUserLogged            : isUserLogged,
            logout                  : logout
        };
    }]);
})();
