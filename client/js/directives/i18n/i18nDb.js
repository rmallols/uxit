(function () {
    'use strict';
    COMPONENTS.directive('i18nDb', ['$rootScope', 'i18nService', 'i18nDbService', 'constantsService',
    function ($rootScope, i18nService, i18nDbService, constantsService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                i18nDb: '='
            },
            template: '<label ng-bind-html-unsafe="label.text"></label>',
            link: function link(scope) {

                function updateLabel() {
                    if (scope.i18nDb) {
                        scope.label = i18nDbService.getI18nProperty(scope.i18nDb);
                    }
                }

                $rootScope.$on(constantsService.collections.languages + 'Loaded', function () {
                    updateLabel();
                });

                scope.$watch('i18nDb', function () {
                    updateLabel();
                });
                $rootScope.$on('languageChanged', function () {
                    updateLabel();
                });
            }
        };
    }]);
})();