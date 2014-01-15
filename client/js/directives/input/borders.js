(function() {
    'use strict';
    COMPONENTS.directive('borders', ['i18nService', function (i18nS) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'borders.html',
            scope: {
                borders: '=ngModel'
            },
            link: function link(scope) {

                scope.showBordersStyle = function() {
                    return scope.borders.color && scope.borders.color !== 'transparent' && scope.borders.width > 0;
                };

                scope.styles = [
                    { id: 'solid',  text: i18nS('editStyles.borders.style.options.solid') },
                    { id: 'dashed', text: i18nS('editStyles.borders.style.options.dashed') },
                    { id: 'dotted', text: i18nS('editStyles.borders.style.options.dotted') },
                    { id: 'double', text: i18nS('editStyles.borders.style.options.double') }
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
