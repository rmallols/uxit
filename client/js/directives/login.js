COMPONENTS.directive('login', ['sessionService', function (sessionService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/login.html',
        scope: {},
		link: function link(scope) {
            scope.logout = function () {
                sessionService.logout();
            };
		}
	};
}]);
