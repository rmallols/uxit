(function() {
    COMPONENTS.directive('createItem', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: false,
            template: '<div></div>',
            scope: {
                internalData: '=',
                onLayer: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {
                var collection = scope.internalData.collection,
                    layerElm = $('<div create-' + collection + ' model="internalData.data" on-layer="onLayer" class="cf"></div>');
                element.html(layerElm);
                $compile(layerElm)(scope);
            }
        };
    }]);
})();