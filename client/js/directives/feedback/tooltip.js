(function (undefined) {
    'use strict';
    COMPONENTS.directive('title', ['$rootScope', 'i18nService', 'i18nDbService',
    function ($rootScope, i18nService, i18nDbService) {
        return {
            restrict: 'A',
            link: function link(scope, element, attrs) {

                attrs.$observe('title', function (newVal) {
                    if (newVal && newVal !== '') {
                        if (!element.data('powertip')) { //Tooltip initialization
                            element.powerTip({
                                smartPlacement : true,
                                mouseOnToPopup : attrs.keepTitleOnTooltipHover === 'true'
                            });
                        }
                        setTitle(newVal);
                    }
                });

                $rootScope.$on('languageChanged', function () {
                    setTitle(attrs.title);
                });

                function setTitle(newTitle) {
                    if (attrs.i18nTitle !== undefined) { //i18n value
                        element.data('powertip', i18nService(newTitle));
                    } else if (attrs.i18nDbTitle !== undefined) { //i18n-db value
                        try { //The title could be a JSON object for i18n pourposes, so it's necessary to get the proper language
                            element.data('powertip', i18nDbService.getI18nProperty(jQuery.parseJSON(newTitle)).text);
                        } catch(ex) { //If the title is not JSON object based (i18ndb is not ready yet, just display the value as it is
                            element.data('powertip', newTitle);
                        }
                    } else { //Plain value
                        element.data('powertip', newTitle);
                    }
                }
            }
        };
    }]);
})(window.undefined);
