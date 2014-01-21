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
            controller: ['$scope', function($scope) {
                $scope.styles = [
                    { id: '',       text: '' },
                    { id: 'solid',  text: i18nS('editStyles.borders.style.options.solid') },
                    { id: 'dashed', text: i18nS('editStyles.borders.style.options.dashed') },
                    { id: 'dotted', text: i18nS('editStyles.borders.style.options.dotted') },
                    { id: 'double', text: i18nS('editStyles.borders.style.options.double') }
                ];
            }],
            link: function link(scope) {

                if(!scope.borders) {
                    scope.borders = {};
                }

                scope.onWidthChange = function() {
                    if(scope.borders.width === null) { scope.borders.width = ''; }
                };
            }
        };
    }]);
})();
