COMPONENTS.directive('userListAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/userListApp/userListAppView.html',
        scope: {
            model: '=',
            onLayerSave: '='
        },
		link: function link(scope) {
            scope.refreshList = function () {};
            scope.onLayerSave = function () {
                scope.refreshList();
            };
        }
	};
});

COMPONENTS.directive('userListAppAdd', function (userService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/userListApp/userListAppAdd.html',
        scope : {
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.onLayerSave = function (callback) {
                userService.createUser(scope.user, function () {
                    callback();
                });
            };
        }
    };
});

COMPONENTS.directive('userListAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/userListApp/userListAppEdit.html'
    };
});