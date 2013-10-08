(function () {
    'use strict';
    COMPONENTS.service('languageSelectAppService', ['i18nService', function (i18nService) {

        function view(scope) {
            scope.languages = i18nService.getLanguages();
            scope.isCurrentLanguage = function (language) {
                return language === i18nService.getCurrentLanguage();
            };
            scope.selectLanguage = function (language) {
                i18nService.changeLanguage(language);
            }
        }

        return {
            view: view
        };
    }]);
})();
