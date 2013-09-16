COMPONENTS.directive('editStyles', [function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'editStyles.html',
        scope: {
            model       : '=',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.level2Tabs = [
                { title: 'editStyles.portal',   styleClass : 'webIcon' },
                { title: 'editStyles.app',      styleClass : 'appIcon' }
            ];
        }
    };
}]);
