COMPONENTS.directive('login', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'login.html',
        scope: {},
		link: function link(scope) {
            scope.userSession = sessionService.getUserSession();
            scope.logout = function () {
                sessionService.logout();
            };
		}
	};
}]);
