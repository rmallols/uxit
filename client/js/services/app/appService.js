(function () {
    'use strict';
    COMPONENTS.factory('appService', ['$rootScope', 'portalService', 'keyboardService',
    function ($rootScope, portalService, keyboardService) {

        var maximized, directiveId = 'app', previousSize;

        /**
         *  Enables the Maximized state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that is being maximized
         * @param {integer}     currentSize The current size of the columns that is wrapping the app that is being maximized
         * @param {function}    onResized   The callback function to be executed once the app that is being maximized
         */
        function enableMaximized(element, currentSize, onResized) {
            maximized = true;
            portalService.enableAppSortableFeature();
            //element.addClass('maximized');
            $('html').addClass('appMaximized'); //Allow CSS setup from external components
            if (portalService.isRealFullscreen()) { element.fullScreen(true); }
            triggerOnResizeEvent(onResized);
            //If 'ESC' key is pressed, the app event won't be called in HTML5 fullscreen mode
            //Consequently, we need to manually disable the maximized state is it's not longer fullscreen
            $(document).bind("fullscreenchange", function () {
                if (!$(document).fullScreen()) {
                    disableMaximized(element, onResized);
                }
            });
            registerKeyboardEvents(element, onResized);



            console.log("********************do this just if portalService.isTemplateFullScreen()")
            console.log("additionally, the maximize button should be disabled for the template apps if the template fullscreen is the active one")
            var columns = element.closest('.columns');
            columns.addClass('colMaximized large-23');
            columns.prev('.columns').addClass('colMaximized');
            columns.next('.columns').addClass('colMaximized');
            previousSize = currentSize;
        }

        /**
         *  Disables the Maximized state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that was maximized
         * @param {function}    onResized   The callback function to be executed once the app that was maximized
         */
        function disableMaximized(element, onResized) {
            maximized = false;
            portalService.disableAppSortableFeature();
            element.removeClass('maximized');
            $('html').removeClass('appMaximized'); //Allow CSS setup from external components
            if ($rootScope.portal.html5Fullscreen) {
                element.fullScreen(false);
            }
            triggerOnResizeEvent(onResized);
            $(document).unbind("fullscreenchange");
            unregisterKeyboardEvents();


            console.log("****SAME ON THE DISABLE SIDE.")
            $('.colMaximized.large-23').removeClass('large-23').addClass('large-' + previousSize);
            $('.colMaximized').removeClass('colMaximized');
        }

        /**
         * Determines if there's any maximized app or not
         *
         * @returns {boolean} True if there's any app maximized. False otherwise
         */
        function isMaximized() {
            return maximized;
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
        function registerKeyboardEvents(element, onResized) {
            keyboardService.register('esc', directiveId, function () { disableMaximized(element, onResized); });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', directiveId);
        }

        return {
            enableMaximized: enableMaximized,
            disableMaximized: disableMaximized,
            isMaximized: isMaximized,
            triggerOnResizeEvent: triggerOnResizeEvent
        };
    }]);
})();