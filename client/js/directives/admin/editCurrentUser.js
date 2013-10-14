COMPONENTS.directive('editCurrentUser', ['$rootScope', 'userService', 'sessionService',
function ($rootScope, userService, sessionService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editCurrentUser.html',
        scope: {
            model: '=',
            onLayer : '='
        },
        link: function link(scope) {

            scope.userSession = sessionService.getUserSession();

            scope.onLayer.save = function (callback) {
                userService.updateUser(scope.userSession, function () {
                    callback();
                });
            };

            scope.logout = function () {
                sessionService.logout();
            };
        }
    };
}]);