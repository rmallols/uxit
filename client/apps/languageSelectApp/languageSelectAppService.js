(function () {
    'use strict';
    COMPONENTS.service('languageSelectAppService', ['$rootScope', 'i18nService', 'constantsService',
    function ($rootScope, i18nService, constantsService) {

        function view(scope) {
            getLanguages();
            scope.isCurrentLanguage = function (language) {
                return language === i18nService.getCurrentLanguage();
            };
            scope.selectLanguage = function (language) {
                i18nService.changeLanguage(language);
            };
            $rootScope.$on(constantsService.collections.languages + 'Loaded', function () {
                getLanguages();
            });

            function getLanguages() {
                //Get the active languages
                scope.languages = i18nService.getLanguages(false);
            }
        }

        return {
            view: view
        };
    }]);
})();
