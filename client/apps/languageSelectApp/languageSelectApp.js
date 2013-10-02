(function () {
    'use strict';

    COMPONENTS.directive('languageSelectAppView', ['i18nService', function (i18nService) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                model : '=',
                internalData : '=',
                onLayerSave : '&'
            },
            templateUrl: 'languageSelectAppView.html',
            link: function (scope) {

                scope.languages = i18nService.getLanguages();

                scope.isCurrentLanguage = function (language) {
                    return language === i18nService.getCurrentLanguage();
                };

                scope.selectLanguage = function (language) {
                    i18nService.changeLanguage(language);
                }
            }
        };
    }]);

    COMPONENTS.directive('languageSelectAppEdit', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                model : '=',
                internalData : '=',
                onLayerSave : '&'
            },
            templateUrl: 'languageSelectAppEdit.html',
            link: function link(scope) {
            }
        };
    }]);
})();