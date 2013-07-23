(function () {
    'use strict';
    COMPONENTS.directive('i18n', ['$rootScope', 'i18nService', function ($rootScope, i18nService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                i18n: '@'
            },
            template: '<label>{{label}}</label>',
            link: function link(scope) {

                scope.$watch('i18n', function () {
                    setLabelValue();
                });

                $rootScope.$on('languageChanged', function () {
                    setLabelValue();
                });

                function setLabelValue() {
                    scope.label = i18nService(scope.i18n);
                }
            }
        };
    }]);
})();
