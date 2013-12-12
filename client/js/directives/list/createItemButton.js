(function() {
    COMPONENTS.directive('createItemButton', ['editBoxUtilsService', function (editBoxUtilsService) {
        return {
            restrict: 'A',
            scope: {
                collection: '=',
                onCreatePanels: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {

                var createItemDefBinding = {};

                scope.createItem = function () {
                    createItem();
                };

                /** Private methods **/
                function createItem() {
                    scope.panels = getCreatePanels();
                    setSharedBindings(scope.panels);
                    scope.onSave = function() {
                        scope.onCreate({$item: createItemDefBinding});
                    };
                    editBoxUtilsService.showEditBox(scope, element, element);
                }

                function getCreatePanels() {
                    var panels;
                    if(scope.onCreatePanels) { //If custom panels are defined for creation, use them
                        panels = scope.onCreatePanels;
                    } else { //Otherwise, use the default create panels
                        panels = [{ title: 'Create item', src: 'createItem' }];
                    }
                    return panels;
                }

                function setSharedBindings(panels) {
                    panels.forEach(function (panel) {
                        if(!panel.bindings) {
                            panel.bindings = {};
                        }
                        panel.bindings.collection = scope.collection;
                        panel.bindings.data = createItemDefBinding;
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})();