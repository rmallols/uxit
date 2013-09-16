COMPONENTS.directive('styles', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'styles.html',
        scope: {
            model : '=styles'
        },
        link: function link() {
        }
    };
}]);
