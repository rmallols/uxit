(function () {
    'use strict';

    COMPONENTS.factory('i18nDbService', ['i18nService', function (i18nService) {

        function getI18nProperty(obj) {
            var currentLanguage = i18nService.getCurrentLanguage(),
                defaultLanguage = i18nService.getDefaultLanguage();
            //The i18n structure will be set if it has not been defined yet
            return (obj && typeof(obj) === 'object') ? (obj[currentLanguage] || obj[defaultLanguage]) : {text: obj};
        }

        function hasI18nStructure(obj) {
            var currentLanguage = i18nService.getCurrentLanguage();
            return obj && obj[currentLanguage] !== undefined;
        }

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
