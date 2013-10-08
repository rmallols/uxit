(function () {
    'use strict';
    COMPONENTS.factory('appService', ['$rootScope', '$location', 'portalService', 'pageService', 'rowService',
    'colService', 'arrayService', 'keyboardService',
    function ($rootScope, $location, portalService, pageService, rowService, colService, arrayService, keyboardService) {

        var fullscreen, directiveId = 'app', previousSize;

        /**
         *  Enables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that is being fullscreened
         * @param {number}      _id         The ID of the app that is being fullscreened
         * @param {number}      currentSize The current size of the columns that is wrapping the app that is being fullscreened
         * @param {function}    onResize    The callback function to be executed once the app that is being fullscreened
         */
        function enableFullscreen(element, _id, currentSize, onResize) {
            if(!isFullscreen()) {
                $('html').addClass('fullscreen');
                fullscreen = true;
                if (portalService.isRealFullscreen()) {
                    enableRealFullscreen(element, onResize);
                } else if(portalService.isMaximizedFullscreen()) {
                    enableMaximizedFullscreen(element, _id);
                } else if(portalService.isTemplateFullscreen()) {
                    enableTemplateFullscreen(element, _id, currentSize);
                }
                triggerOnResizeEvent(onResize);
                registerKeyboardEvents(element, onResize);
            }
        }

        /**
         *  Disables the fullscreen state of a given app
         *
         * @param {object}      element     The pointer to the root object of the app that was fullscreened
         * @param {function}    onResize   The callback function to be executed once the app that was fullscreened
         */
        function disableFullscreen(element, onResize) {
            $('html').removeClass('fullscreen');
            fullscreen = false;
            if (portalService.isRealFullscreen()) {
                disableRealFullscreen(element);
            } else if(portalService.isMaximizedFullscreen()) {
                disableMaximizedFullscreen(element);
            } else if(portalService.isTemplateFullscreen()) {
                disableTemplateFullscreen(element);
            }
            triggerOnResizeEvent(onResize);
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
         * @param {function} onResizeEvent The function to be triggered
         */
        function triggerOnResizeEvent(onResizeEvent) {
            //Give some delay to the onResize callback as it could be affected by the asnync html5 fullscreen event
            if (onResizeEvent) {
                setTimeout(function () { onResizeEvent(); }, 100);
            }
        }

        /**
         * Deletes a given app
         *
         * @param {object}  appElm      The pointer to the DOM object where the app that is going to be deleted id
         * @param {number}  appIndex    The index of the app in the context of the column where it is
         */
        function deleteApp(appElm, appIndex) {
            var columnScope = angular.element(appElm.closest('.columns')).scope(),
                apps = columnScope.column.apps,
                rowScope = columnScope.$parent,
                columns = rowScope.row.columns,
                rows = rowService.getWrappingRows(rowScope, portalService.getPortal().template.rows);
            arrayService.delete(apps, appIndex);
            if (apps.length === 0) {
                colService.deleteColAndDependencies(columns, columnScope.$index);
                if (columns.length === 1 && !rowService.isTemplateRow(rowScope.row)) {
                    rowService.deleteRowAndDependencies(rows, rowScope.$index);
                }
            }
            pageService.updateCurrentPage(null);
            portalService.updatePortal(null);
        }

        /** Private methods **/
        function enableRealFullscreen(element, onResize) {
            $('html').addClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('realFullscreen');
            element.fullScreen(true);
            //If 'ESC' key is pressed, the app event won't be called in HTML5 fullscreen mode
            //Consequently, we need to manually disable the fullscreen state is it's not longer fullscreen
            $(document).bind("fullscreenchange", function () {
                if (!$(document).fullScreen()) {
                    disableFullscreen(element, onResize);
                }
            });
        }

        function disableRealFullscreen(element) {
            $('html').removeClass('appRealFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('realFullscreen');
            element.fullScreen(false);
            $(document).unbind("fullscreenchange");
        }

        function enableMaximizedFullscreen(element, _id) {
            $('html').addClass('appMaximizedFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('maximizedFullscreen');
            updateSearchId(_id);
        }

        function disableMaximizedFullscreen(element) {
            $('html').removeClass('appMaximizedFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('maximizedFullscreen');
            updateSearchId(null);
        }

        function enableTemplateFullscreen(element, _id, currentSize) {
            var columns = element.closest('.columns');
            columns.addClass('colFullscreen large-23');
            columns.prev('.columns').addClass('colFullscreen');
            columns.next('.columns').addClass('colFullscreen');
            previousSize = currentSize;
            $('html').addClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.addClass('templateFullscreen');
            updateSearchId(_id);
        }

        function disableTemplateFullscreen(element) {
            $('.colFullscreen.large-23').removeClass('large-23').addClass('large-' + previousSize);
            $('.colFullscreen').removeClass('colFullscreen');
            $('html').removeClass('appTemplateFullscreen'); //Allow CSS setup from ancestor DOM elements
            element.removeClass('templateFullscreen');
            updateSearchId(null);
        }

        function registerKeyboardEvents(element, onResize) {
            keyboardService.register('esc', directiveId, function () {
                disableFullscreen(element, onResize);
                $rootScope.$apply();
            });
        }

        function unregisterKeyboardEvents() {
            keyboardService.unregister('esc', directiveId);
        }

        function updateSearchId(_id) {
            $location.search('_id', _id);
        }
        /** End of private methods **/

        return {
            enableFullscreen: enableFullscreen,
            disableFullscreen: disableFullscreen,
            isFullscreen: isFullscreen,
            triggerOnResizeEvent: triggerOnResizeEvent,
            deleteApp: deleteApp
        };
    }]);
})();