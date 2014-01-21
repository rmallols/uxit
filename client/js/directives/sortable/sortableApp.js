(function () {
    'use strict';
    COMPONENTS.directive('sortableApp', ['pageService', 'sortableAppService', function (pageService, sortableAppService) {
        return {
            restrict: 'A',
            replace: false,
            link: function link(scope, element, attrs) {

                var sortableWrapElm = element.closest('[sortable-app]');
                scope.sortableOptions = {};

                function instantiateSortableApp() {
                    scope.sortableOptions = {
                        items               : '.app',
                        /*handle              : '.content',*/
                        cancel              : '.content > *',
                        connectWith         : '[sortable-app]',
                        placeholder         : 'sortingPlaceholder',
                        tolerance           : 'pointer',
                        cursorAt            : { top: 0, left: 0 },
                        start: function (event, ui) {
                            sortableAppService.start(ui);
                            sortableAppService.broadcastStartSortingApp();
                        },
                        update: function (event, ui) {
                            sortableAppService.update(ui);
                        },
                        stop: function () {
                            sortableAppService.stop();
                            sortableAppService.broadcastStopSortingApp();
                        }
                    };
                }

                instantiateSortableApp();

                attrs.$observe('sortableApp', function (newVal) {
                    if (newVal !== 'true') { //Block the sort capability if the user doesn't have permissions enough
                        sortableWrapElm.sortable('disable');
                    } else {
                        sortableWrapElm.sortable('enable');
                    }
                });
            }
        };
    }]);
})();