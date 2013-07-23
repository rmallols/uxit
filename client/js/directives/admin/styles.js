COMPONENTS.directive('styles', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/html/admin/styles.html',
        scope: {
            model : '=styles'
        },
        link: function link() {
        }
    };
}]);
