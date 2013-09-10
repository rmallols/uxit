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

        /**
         * Retrieves the i18n value of a given key
         *
         * @returns {Function} The function that returns the value of the given key
         */
        function i18n() {
            return $.i18n.prop.apply($.i18n, arguments);
        }

        /**
         * Loads all the available languages in the system
         *
         * @param {function} callback The function to execute once all the languages have been loaded
         */
        i18n.loadLanguages = function (callback) {
            crudService.get(constantsService.collections.languages, null, {}, function (loadedLanguages) {
                languages = loadedLanguages.results;
                if (callback) { callback(i18n.getLanguages()); }
            });
        };

        /**
         * Gets all the loaded languages
         *
         * @returns {array} The array with the loaded languages
         */
        i18n.getLanguages = function () {
            return languages;
        };

        /**
         * Gets the current language
         *
         * @returns {string} The current language code
         */
        i18n.getCurrentLanguage = function () {
            return settings.language;
        };

        /**
         * Gets the default language
         *
         * @returns {string} The default language code
         */
        i18n.getDefaultLanguage = function () {
            return defaultLanguage;
        };

        /**
         * Changes the language code
         *
         * @param {string} langCode The language that is going to be set as the current one
         */
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
