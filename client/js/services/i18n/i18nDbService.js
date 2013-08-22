(function () {
    'use strict';

    COMPONENTS.factory('i18nDbService', ['i18nService', 'objectService', function (i18nService, objectService) {

        /**
         * Gets the i18n value of a given object
         *
         * @param   {object}    obj The object that holds the i18n information in all the available languages
         * @returns {object}        The {text: value} format object with the value of the current or default language
         */
        function getI18nProperty(obj) {
            var currentLanguage = i18nService.getCurrentLanguage(),
                defaultLanguage = i18nService.getDefaultLanguage();
            //The i18n structure will be set if it has not been defined yet
            return (obj && objectService.isObject(obj)) ? (obj[currentLanguage] || obj[defaultLanguage]) : {text: obj};
        }

        /**
         * Determines if a given object has or not i18n structure
         *
         * @param   {object}    obj The object that is going to be analyzed
         * @returns {boolean}       True if the given object has i18n structure. False otherwise
         */
        function hasI18nStructure(obj) {
            var currentLanguage = i18nService.getCurrentLanguage();
            return obj && obj[currentLanguage] !== undefined;
        }

        /**
         * Initializes the i18n structure of a given object
         *
         * @param   {object}  obj   The object that holds the value that is going to be normalized into i18n format
         * @returns {object}        The object with the i18n format ({defaultLanguage: { text: value}}}
         */
        function setInitI18nStructure(obj) {
            var objText = obj;
            obj = {};
            obj[i18nService.getDefaultLanguage()] = {
                text: objText
            };
            return obj;
        }

        return {
            getI18nProperty: getI18nProperty,
            hasI18nStructure: hasI18nStructure,
            setInitI18nStructure: setInitI18nStructure
        };
    }]);
})();
