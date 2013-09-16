(function() {
    'use strict';
    COMPONENTS.directive('password', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace: true,
            templateUrl: 'password.html',
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