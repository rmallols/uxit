(function () {
    'use strict';
    COMPONENTS.factory('tooltipService', ['i18nService', 'i18nDbService', function (i18nService, i18nDbService) {

        function setTitle(newTitle, element, isHtml) {
            hide(); //The tooltip has to be closed first in order to get che new title refreshed
            var hasI18nTitle = element.attr('i18n-title'), hasI18nDbTitle = element.attr('i18n-db-title');
            if(isHtml) { //The data comes as HTML, so as it doesn't make sense do to anything with it, display it as it is
                element.data('powertip', newTitle);
            } else if (hasI18nTitle !== undefined) { //i18n value
                element.data('powertip', i18nService(newTitle));
            } else if (hasI18nDbTitle !== undefined) { //i18n-db value
                try { //The title could be a JSON object for i18n pourposes, so it's necessary to get the proper language
                    element.data('powertip', i18nDbService.getI18nProperty(jQuery.parseJSON(newTitle)).text);
                } catch(ex) { //If the title is not JSON object based (i18ndb is not ready yet, just display the value as it is
                    element.data('powertip', newTitle);
                }
            } else { //Plain value
                element.data('powertip', newTitle);
            }
        }

        function initialize(element, title, customOptions, isHtml) {
            var options;
            if (title && title !== '') {
                if (!exists(element)) { //Tooltip initialization
                    options = angular.extend(getDefaults(), customOptions);
                    element.powerTip(options);
                }
                setTitle(title, element, isHtml);
            }
        }

        function show(element) {
            if(exists(element)) {
                $.powerTip.show(element);
            }
        }

        function hide() {
            $.powerTip.hide(null, true);
        }

        function exists(element) {
             return element.data('powertip');
        }

        function onClose(element, callback) {
            element.on({
                powerTipClose: function() {
                    if(callback) { callback(); }
                }
            });
        }

        function getDefaults() {
            return {
                smartPlacement : true,
                fadeInTime: 0,
                fadeOutTime: 0,
                closeDelay: 200,
                mouseOnToPopup : false
            };
        }

        return {
            initialize: initialize,
            show: show,
            hide: hide,
            setTitle: setTitle,
            onClose: onClose,
            getDefaults: getDefaults
        };
    }]);
})();
