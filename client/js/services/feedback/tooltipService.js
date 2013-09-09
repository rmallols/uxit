(function () {
    'use strict';
    COMPONENTS.factory('tooltipService', ['i18nService', 'i18nDbService', function (i18nService, i18nDbService) {

        /**
         * Updates the title attribute of a given DOM object
         *
         * @param {string}  newTitle    The text that is going to be set as the new title of the DOM object
         * @param {object}  element     The pointer to the DOM object where the title is going to be attached
         * @param {boolean} isHtml      True if the text is going to be displayed as rich, HTML format. False otherwise
         */
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

        /**
         * Initializes the title attribute of a given DOM object
         *
         * @param {object}  element         The pointer to the DOM object where the title is going to be attached
         * @param {string}  title           The text that is going to be set as the new title of the DOM object
         * @param {object}  customOptions   Title options (positions, fades...)
         * @param {boolean} isHtml          True if the text is going to be displayed as rich, HTML format. False otherwise
         */
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

        /**
         * Shows the title of a given DOM object
         *
         * @param {object} element The pointer to the DOM object where the title is going to be shown
         */
        function show(element) {
            if(exists(element)) {
                $.powerTip.show(element);
            }
        }

        /**
         * Hides all the currently alive titles
         *
         */
        function hide() {
            $.powerTip.hide(null, true);
        }

        /**
         * Executes a callback function whenever the title attached to a DOM object is closed
         *
         * @param {object}      element     The pointer to the DOM object where the event is going to be triggered
         * @param {function}    callback    The function to execute whenever the title attached to the DOM object is closed
         */
        function onClose(element, callback) {
            element.on({
                powerTipClose: function() {
                    if(callback) { callback(); }
                }
            });
        }

        /**
         * Gets the title default options
         *
         * @returns {{smartPlacement: boolean, fadeInTime: number, fadeOutTime: number, closeDelay: number, mouseOnToPopup: boolean}}
         * The title default options
         */
        function getDefaults() {
            return {
                smartPlacement : true,
                fadeInTime: 0,
                fadeOutTime: 0,
                closeDelay: 200,
                mouseOnToPopup : false
            };
        }

        /** Private methods **/
        function exists(element) {
            return element.data('powertip');
        }
        /** End of private methods **/

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
