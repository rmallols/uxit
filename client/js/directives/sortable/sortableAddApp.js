(function () {
    'use strict';
    COMPONENTS.directive('sortableAddApp', ['sortableAppService', 'keyboardService', '$timeout',
    function (sortableAppService, keyboardService, $timeout) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element) {

                function start(ui) {
                    //Force the size of the dragging element to be as it originally was
                    $(ui.helper).css({width: element.outerWidth(), height: element.outerHeight()});
                    registerKeyboardEvents();
                    sortableAppService.broadcastStartSortingApp();
                }

                function stop() {
                    unregisterKeyboardEvents();
                    sortableAppService.broadcastStopSortingApp();
                }

                function registerKeyboardEvents() {
                    keyboardService.register('esc', 'sortableAddApp', function () {
                        element.trigger('mouseup');
                    });
                }

                function unregisterKeyboardEvents() {
                    keyboardService.unregister('esc', 'sortableAddApp');
                }

                $timeout(function () {
                    element.draggable({
                        helper              : 'clone',
                        connectToSortable   : '[sortable-app]',
                        forceHelperSize     : true,
                        tolerance           : 'pointer',
                        cursorAt            : { top: 0, left: 0 },
                        start: function (event, ui) {
                            start(ui);
                        },
                        stop: function () {
                            stop();
                        }
                    });
                }, 0);
            }
        };
    }]);
})();