(function (document) {
    'use strict';
    COMPONENTS.directive('boxSortable', ['keyboardService', function (keyboardService) {
        return {
            restrict: 'A',
            transclude: true,
            template: '<ul class="sortable" ng-transclude></ul>',
            scope: {
                onChange        : '=uxChange',
                handle          : '@',
                connectWith     : '@'
            },
            replace: true,
            link: function link(scope, element, attrs) {

                var updateFn = function () { if (scope.onChange) { scope.onChange(); }},
                    sortingElms = (attrs.connectWith) ? $(attrs.connectWith) : element;

                element.sortable({
                    placeholder: "sortingPlaceholder",
                    forceHelperSize: true,
                    forcePlaceholderSize: true,
                    connectWith: attrs.connectWith,
                    tolerance: 'pointer',
                    handle: attrs.handle || '',
                    cursorAt: { top: 0, left: 0 },
                    start: function (/*event, ui*/) {
                        sortingElms.addClass('sorting');
                        //Wire the 'esc' event with the cancellation of the sorting changes
                        keyboardService.register('esc', 'boxSortable', function () {
                            //It's necessary to manually define what is considered as a cancellation
                            element.sortable('option',  'update', function () { return false; });
                            $(document).trigger("mouseup");
                            //Therefore, it's necessary to restore the 'update' event
                            element.sortable('option',  'update', function () { updateFn(); });
                        });
                    },
                    stop: function (event, ui) {
                        sortingElms.removeClass('sorting');
                        //Once the sorting process stops, the 'esc' event is unregistered to allow being triggered by others
                        keyboardService.unregister('esc', 'boxSortable');
                    },
                    update: updateFn
                });
                element.disableSelection();
            }
        };
    }]);
})(window.document);
