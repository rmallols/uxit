(function () {
    'use strict';

    var forEach = angular.forEach;

    COMPONENTS.factory('i18nService', ['$rootScope', 'crudService', 'constantsService',
    function ($rootScope, crudService, constantsService) {

        var languages = [], activeLanguages = [], defaultLanguage, isInitialized = false,
            settings = {
                name    : 'messages',
                path    : '/client/messages/',
                mode    : 'map',
                callback: function () {
                    isInitialized = true;
                }
            };

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
            var params = { sort : { field: 'position', order : '1' }};
            crudService.get(constantsService.collections.languages, null, params, function (loadedLanguages) {
                onLoadedLanguages(loadedLanguages);
                //Broadcast the fact that the languages have been successfully updated
                //please note that the languagesChanged callback doesn't fit here
                //as it happens before the memory references are updated (languages and activeLanguages)
                $rootScope.$broadcast(constantsService.collections.languages + 'Loaded');
                if (callback) { callback(languages); }
            });
        };

        /**
         * Updates an existing language
         *
         * @param {object}      language    The object that stores the existing language information
         * @param {function}    callback    The function to be executed once the language has been fully updated
         */
        i18n.updateLanguage = function (language, callback) {
            var langData = {
                inactive: language.inactive
            };
            crudService.update(constantsService.collections.languages, language._id, langData, function (updatedLanguage) {
                //Reload the languages from the backend so all the listener that could use
                //the .getLanguages() method will receive the most up to date stuff
                i18n.loadLanguages(function() {
                    if (callback) {
                        callback(updatedLanguage);
                    }
                });
            });
        };

        /**
         * Gets all the loaded languages
         * @param   {boolean}   includeInactiveLanguages    Defines if inactive languages
         *                                                  will also be returned or not
         * @returns {Array}                                 The array with the loaded languages
         */
        i18n.getLanguages = function (includeInactiveLanguages) {
            return (includeInactiveLanguages) ? languages : activeLanguages;
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
            if(!defaultLanguage) {
                defaultLanguage = getFirstActiveLanguage();
            }
            return defaultLanguage;
        };

        /**
         * Changes the language code
         *
         * @param {string} langCode The language that is going to be set as the current one
         */
        i18n.changeLanguage = function changeLanguage(langCode) {
            var datePickerLangCode;
            if (langCode !== settings.language && !isLanguageInactive(langCode)) {
                settings.language = langCode;
                $.i18n.properties(settings);
                datePickerLangCode = (langCode === i18n.getDefaultLanguage()) ? '' : langCode;
                $.datepicker.setDefaults( $.datepicker.regional[datePickerLangCode] );
                $rootScope.$broadcast('languageChanged', langCode);
            }
        };

        /** Private methods **/
        function onLoadedLanguages(loadedLanguages) {
            var currentLanguage = getCurrentLanguage();
            languages           = loadedLanguages.results;
            activeLanguages     = getActiveLanguages();
            if(!isInitialized) { //The very first time, initialize the resource bundles
                settings.language = currentLanguage;
                $.i18n.properties(settings);
            } else { //If the languages were loaded previously, just update the bundles
                i18n.changeLanguage(currentLanguage);
            }
        }

        function getCurrentLanguage() {
            var currentLanguage, browserLanguage = getBrowserLanguage();
            if(!isLanguageInactive(browserLanguage)) {
                currentLanguage = browserLanguage;
            } else {
                currentLanguage = i18n.getDefaultLanguage();
            }
            return currentLanguage;
        }

        function getActiveLanguages() {
            var activeLanguages = [];
            if(languages.length) {
                forEach(languages, function(language) {
                    if(!language.inactive) {
                        activeLanguages.push(language);
                    }
                });
            }
            return activeLanguages;
        }

        function isLanguageInactive(langCode) {
            var languageInactive = false;
            if(languages.length) {
                forEach(languages, function(language) {
                    if(language.code === langCode && !languageInactive) {
                        languageInactive = language.inactive;
                    }
                });
            }
            return languageInactive;
        }

        function getBrowserLanguage() {
            return (navigator.language || navigator.userLanguage).split('-')[0];
        }

        function getFirstActiveLanguage() {
            var firstActiveLanguage = null;
            if(languages.length) {
                forEach(languages, function(language) {
                    if(!language.inactive && !firstActiveLanguage) {
                        firstActiveLanguage = language.code;
                    }
                });
            }
            return firstActiveLanguage;
        }
        /** End of private methods **/

        return i18n;
    }]);
})();
