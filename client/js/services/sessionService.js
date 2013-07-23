(function () {
    'use strict';
    COMPONENTS.factory('sessionService', ['$rootScope', '$routeParams', 'ajaxService',
    function ($rootScope, $routeParams, ajaxService) {

        /**
         *
         *
         * @param callback
         */
        function getSession(callback) {
            ajaxService.ajax({
                url     : '/rest/getSession/',
                method  : 'POST',
                data    : {},
                success	: function (response) {
                    if (callback) {
                        callback(response);
                    }
                }
            });
        }

        /**
         *
         *
         * @param model
         */
        function addSessionDataToModel(model) {
            model.create.author = $rootScope.portal.user;
            delete model.create.authorId;
        }

        /**
         *
         *
         * @returns {boolean}
         */
        function isUserLogged() {
            return $rootScope.portal.user !== undefined;
        }

        /**
         *
         *
         */
        function logout() {
            window.open('/' + $routeParams.portal + '/logout', '_self');
        }

        return {
            //login: login,
            getSession              : getSession,
            addSessionDataToModel   : addSessionDataToModel,
            isUserLogged            : isUserLogged,
            logout                  : logout
        };
    }]);
})();
