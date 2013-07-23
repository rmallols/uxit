(function () {
    'use strict';

    COMPONENTS.factory('canvasService', [function () {

        /**
         * Gets the coordinates of a canvas object
         *
         * @param   {object} canvasObj  The wrapping <canvas> DOM object pointer
         * @param   {object} canvasElm  The canvas object of which the coordinates are required
         * @returns {object} The canvas object coordinates (top, left, width, height)
         */
        function getCoordinates(canvasObj, canvasElm) {
            var scaleX = canvasElm.scaleX || 1, scaleY = canvasElm.scaleY || 1,
                canvasElmWidth = canvasElm.width * scaleX, canvasElmHeight = canvasElm.height * scaleY;
            return {
                top     : canvasObj.offset().top + canvasElm.top - (canvasElmHeight) / 2,
                left    : canvasElm.left - (canvasElmWidth) / 2,
                width   : canvasElmWidth,
                height  : canvasElmHeight
            };
        }

        return {
            getCoordinates: getCoordinates
        };
    }]);
})();
