(function () {
    'use strict';

    COMPONENTS.factory('i18nService', ['$rootScope', 'crudService', 'constantsService',
    function ($rootScope, crudService, constantsService) {

        /** Private methods **/
        function getBrowserLanguage() {
            return (navigator.language || navigator.userLanguage).split('-')[0];
        }
        /** End private methods **/

        var languages,
            userLanguage    = getBrowserLanguage(),
            defaultLanguage = 'en',
            settings = {
                name: 'messages',
                path: '/client/messages/',
                mode: 'map',
                language: userLanguage,
                callback: function () {}
            };

        $.i18n.properties(settings);

        function i18n() {
            return $.i18n.prop.apply($.i18n, arguments);
        }

        i18n.loadLanguages = function (callback) {
            crudService.get(constantsService.collections.languages, null, {}, function (loadedLanguages) {
                languages = loadedLanguages.results;
                if (callback) { callback(i18n.getLanguages()); }
            });
        };

        i18n.getLanguages = function () {
            return languages;
        };

        i18n.getCurrentLanguage = function () {
            return settings.language;
        };

        i18n.getDefaultLanguage = function () {
            return defaultLanguage;
        };

        i18n.changeLanguage = function changeLanguage(langCode) {
            if (langCode !== settings.language) {
                settings.language = langCode;
                $.i18n.properties(settings);
                $rootScope.$broadcast('languageChanged', langCode);
            }
        };

        return i18n;
    }]);
})();
