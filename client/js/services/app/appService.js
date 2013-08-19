(function () {
    'use strict';
    COMPONENTS.factory('appService', ['$rootScope', '$location', 'portalService', 'keyboardService',
    function ($rootScope, $location, portalService, keyboardService) {

        var fullscreen, directiveId = 'app', previousSize;

        /**
         *  Enables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that is being fullscreened
         * @param {integer}     _id         The ID of the app that is being fullscreened
         * @param {integer}     currentSize The current size of the columns that is wrapping the app that is being fullscreened
         * @param {function}    onResized   The callback function to be executed once the app that is being fullscreened
         */
        function enableFullscreen(element, _id, currentSize, onResized) {
            if(!isFullscreen()) {
                $location.search('_id', _id);
                $('html').addClass('fullscreen');
                fullscreen = true;
                portalService.enableAppSortableFeature();
                if (portalService.isRealFullscreen()) {
                    enableRealFullscreen(element, onResized);
                } else if(portalService.isMaximizedFullscreen()) {
                    enableFullscreenFullscreen(element);
                } else if(portalService.isTemplateFullscreen()) {
                    enableTemplateFullscreen(element, currentSize);
                }
                triggerOnResizeEvent(onResized);
                registerKeyboardEvents(element, onResized);
            }
        }

        /**
         *  Disables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that was fullscreened
         * @param {function}    onResized   The callback function to be executed once the app that was fullscreened
         */
        function disableFullscreen(element, onResized) {
            $location.search({});
            $('html').removeClass('fullscreen');
            fullscreen = false;
            portalService.disableAppSortableFeature();
            if (portalService.isRealFullscreen()) {
                disableRealFullscreen(element);
            } else if(portalService.isMaximizedFullscreen()) {
                disableFullscreenFullscreen(element);
            } else if(portalService.isTemplateFullscreen()) {
                disableTemplateFullscreen(element);
            }
            triggerOnResizeEvent(onResized);
            unregisterKeyboardEvents();
        }

        /**
         * Determines if there's any fullscreen app or not
         *
         * @returns {boolean} True if there's any app fullscreen. False otherwise
         */
        function isFullscreen() {
            return fullscreen;
        }

        /**
         * Triggers the onResize event of an app
         *
         * @param {function} onResized The function to be triggered
         */
        function triggerOnResizeEvent(onResized) {
            //Give some delay to the onResized callback as it could be affected by the asnync html5 fullscreen event
            if (onResized) { setTimeout(function () { onResized(); }, 100); }
        }

        /** Private methods **/
        function enableRealFullscreen(element, onResized) {
            $('html').addClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('realFullscreen');
            element.fullScreen(true);
            //If 'ESC' key is pressed, the app event won't be called in HTML5 fullscreen mode
            //Consequently, we need to manually disable the fullscreen state is it's not longer fullscreen
            $(document).bind("fullscreenchange", function () {
                if (!$(document).fullScreen()) {
                    disableFullscreen(element, onResized);
                }
            });
        }

        function disableRealFullscreen(element) {
            $('html').removeClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('realFullscreen');
            element.fullScreen(false);
            $(document).unbind("fullscreenchange");
        }

        function enableFullscreenFullscreen(element) {
            $('html').addClass('appFullscreenFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('fullscreenFullscreen');
        }

        function disableFullscreenFullscreen(element) {
            $('html').removeClass('appFullscreenFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('fullscreenFullscreen');
        }

        function enableTemplateFullscreen(element, currentSize) {
            var columns = element.closest('.columns');
            columns.addClass('colFullscreen large-23');
            columns.prev('.columns').addClass('colFullscreen');
            columns.next('.columns').addClass('colFullscreen');
            previousSize = currentSize;
            $('html').addClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('templateFullscreen');
        }

        function disableTemplateFullscreen(element) {
            $('.colFullscreen.large-23').removeClass('large-23').addClass('large-' + previousSize);
            $('.colFullscreen').removeClass('colFullscreen');
            $('html').removeClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('templateFullscreen');
        }

        function registerKeyboardEvents(element, onResized) {
            keyboardService.register('esc', directiveId, function () { disableFullscreen(element, onResized); });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', directiveId);
        }

        return {
            enableFullscreen: enableFullscreen,
            disableFullscreen: disableFullscreen,
            isFullscreen: isFullscreen,
            triggerOnResizeEvent: triggerOnResizeEvent
        };
    }]);
})();