(function() {
    'use strict';
    COMPONENTS.directive('borders', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'borders.html',
            scope: {
                borders: '=ngModel'
            },
            link: function link(scope) {

                scope.showBordersStyles = function() {
                    return scope.borders.color && scope.borders.color !== 'transparent';
                };

                scope.styles = [
                    { id: 'solid',  text: 'Solidxxx' },
                    { id: 'dashed', text: 'Dashedxxx' },
                    { id: 'dotted', text: 'Dottedxxx' },
                    { id: 'double', text: 'Doublexxx' }
                ];

                if(!scope.borders) {
                    scope.borders = {
                        width: 3,
                        style: scope.styles[0].id
                    };
                }
            }
        };
    }]);
})();
