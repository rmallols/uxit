(function () {
    'use strict';
    COMPONENTS.factory('sessionService', ['$rootScope', '$routeParams', 'ajaxService',
    function ($rootScope, $routeParams, ajaxService) {

        var userSession;

        /**
         *
         *
         * @param callback
         */
        function loadUserSession(callback) {
            ajaxService.ajax({
                url     : '/rest/getSession/',
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

        function getUserSession() {
            return userSession;
        }

        /**
         *
         *
         * @param model
         */
        function addSessionDataToModel(model) {
            model.create.author = getUserSession();
            delete model.create.authorId;
        }

        /**
         *
         *
         * @returns {boolean}
         */
        function isUserLogged() {
            var userSession = getUserSession();
            return userSession !== null && userSession !== undefined;
        }

        /**
         *
         *
         */
        function logout() {
            window.open('/' + $routeParams.portal + '/logout', '_self');
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
