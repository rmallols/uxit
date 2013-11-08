(function() {
    COMPONENTS.directive('toggleStyle', ['$timeout', function ($timeout) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            template: '<button ng-click="toggleState()" ng-class="{active:isActive()}" on-change="propagateChanges()"></button>',
            scope: {
                model       : '=ngModel',
                onChange    : '&'
            },
            link: function link(scope, element, attrs) {

                scope.toggleState = function () {
                    /** @namespace attrs.inactiveWhen */
                    /** @namespace attrs.activeWhen */
                    scope.model = (!scope.isActive()) ? attrs.activeWhen : attrs.inactiveWhen || '';
                    //Due to some strange reason, it's possible that at this moment the model has not been update yet,
                    //so the onChange method propagates the old one. We execute the callback in a new thread to avoid this
                    $timeout(function () { if (scope.onChange) { scope.onChange(); }}, 0);
                };

                scope.isActive = function () {
                    return scope.model === attrs.activeWhen;
                };
            }
        };
    }]);
})();