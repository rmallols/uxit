(function () {
    'use strict';

    COMPONENTS.factory('domService', [function () {

        /**
         * Gets the coordinates of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the coordinates are required
         * @returns {object}        The DOM object coordinates (top, left, width, height)
         */
        function getCoordinates(obj) {
            return {
                top     : obj.offset().top,
                left    : obj.offset().left,
                width   : obj.outerWidth(),
                height  : obj.outerHeight()
            };
        }

        /**
         * Gets the internal padding of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the padding attributes are required
         * @returns {object}        The DOM object padding (top, right, bottom, left)
         */
        function getObjPadding(obj) {
            return {
                top     : parseInt(obj.css('paddingTop'), 10),
                right   : parseInt(obj.css('paddingRight'), 10),
                bottom  : parseInt(obj.css('paddingBottom'), 10),
                left    : parseInt(obj.css('paddingLeft'), 10)
            };
        }

        /**
         * Gets the border width of a given DOM object
         *
         * @param   {object} obj    The DOM object pointer of which the border width attributes are required
         * @returns {object}        The DOM object border (top, right, bottom, left)
         */
        function getObjBorderWidth(obj) {
            return {
                top     : parseInt(obj.css('borderTopWidth'), 10),
                right   : parseInt(obj.css('borderRightWidth'), 10),
                bottom  : parseInt(obj.css('borderBottomWidth'), 10),
                left    : parseInt(obj.css('borderLeftWidth'), 10)
            };
        }

        /**
         * Gets the type of a given DOM object pointer
         *
         * @param   {object} obj    The DOM object pointer of which the type is required
         * @returns {string}        The element type of the DOM object pointer
         */
        function getElementType(obj) {
            return obj[0].tagName.toLowerCase();
        }

        /**
         * Gets the percent of the HTML of a given CSS property
         *
         * @param   {object} dest           The DOM object pointer of which the CSS property is going to be analyzed
         * @param   {string} cssProperty    The snaked-case CSS property to be evaluated
         * @returns {number}                The global percent of the CSS property related
         */
        function getDomPercent(dest, cssProperty) {
            if (!(dest instanceof jQuery)) {
                dest = $(dest);
            }
            return Math.round(parseInt(dest.css(cssProperty), 10) * 100 / $('html').width());
        }

        /**
         * Adds a visual loading marker to the given DOM object pointer
         *
         * @param {object} domObject the DOM object pointer that is going to receive the visual loading marker
         */
        function addLoadingFeedback(domObject) {
            domObject.addClass('loading');
        }

        /**
         * Removes the visual loading marker to the given DOM object pointer
         *
         * @param {object} domObject the DOM object pointer that is going to drop the visual loading marker
         */
        function removeLoadingFeedback(domObject) {
            domObject.removeClass('loading');
        }

        /**
         * Converts a jQuery DOM object into a plain string
         *
         * @param   {object}    domObj  The pointer to the DOM object that is going to be converted
         * @returns {string}            The converted string
         */
        function convertDomObjToStr(domObj) {
            return $('<div>').append(domObj.clone()).html();
        }

        return {
            getCoordinates: getCoordinates,
            getObjPadding: getObjPadding,
            getObjBorderWidth: getObjBorderWidth,
            getElementType: getElementType,
            getDomPercent: getDomPercent,
            addLoadingFeedback: addLoadingFeedback,
            removeLoadingFeedback: removeLoadingFeedback,
            convertDomObjToStr: convertDomObjToStr
        };
    }]);
})();
