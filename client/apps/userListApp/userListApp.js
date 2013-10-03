COMPONENTS.directive('userListAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'userListAppView.html',
        scope: {
            model: '=',
            onLayerSave : '='
        }
	};
});

COMPONENTS.directive('userListAppAdd', function (userService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'userListAppAdd.html',
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
        templateUrl: 'userListAppEdit.html'
    };
});