(function() {
    'use strict';
    COMPONENTS.directive('createItem', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: false,
            template: '<div></div>',
            scope: {
                collection: '=',
                data: '=',
                onLayer: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {
                var collection = scope.collection,
                    layerElm = $('<div create-' + collection + ' model="data" on-layer="onLayer" class="cf"></div>');
                element.html(layerElm);
                $compile(layerElm)(scope);
            }
        };
    }]);
})();