(function() {
    'use strict';
    COMPONENTS.directive('password', [function () {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            templateUrl: '/client/html/input/password.html',
            scope: {
                model: '=ngModel'
            },
            link: function (scope) {
                scope.togglePassword = function() {
                    scope.changePasswordActive = scope.changePasswordActive !== true;
                    if(!scope.hangePasswordActive) {
                        scope.model = null;
                    }
                };
            }
        };
    }]);
})();