(function () {
    'use strict';
    COMPONENTS.directive('listExpandedView', [function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<div ng-show="detailId"><div ng-transclude></div></div>'
        };
    }]);
})();