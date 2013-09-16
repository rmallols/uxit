COMPONENTS.directive('editCurrentUser', ['$rootScope', 'userService', 'sessionService',
function ($rootScope, userService, sessionService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'editCurrentUser.html',
        scope: {
            model: '=',
            onLayerSave: '='
        },
        link: function link(scope) {

            scope.userSession = sessionService.getUserSession();

            scope.onLayerSave = function (callback) {
                userService.updateUser(scope.currentUser, function () {
                    callback();
                });
            };

            scope.logout = function () {
                sessionService.logout();
            };
        }
    };
}]);