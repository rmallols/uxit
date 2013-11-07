(function() {
    COMPONENTS.directive('createItemButton', ['$injector', 'crudService', 'editBoxUtilsService',
    function ($injector, crudService, editBoxUtilsService) {
        return {
            restrict: 'A',
            scope: {
                collection: '=',
                onCreatePanels: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {

                scope.createItem = function () {
                    createItem();
                };

                /** Private methods **/
                function createItem() {
                    scope.panels = getCreatePanels();
                    scope.internalData = {
                        collection: scope.collection,
                        data: {}
                    };
                    scope.onSave = function() {
                        scope.onCreate({$item: scope.internalData.data});
                    };
                    editBoxUtilsService.showEditBox(scope, element, element);
                }

                function getCreatePanels() {
                    var panels;
                    if(scope.onCreatePanels) { //If custom panels are defined for creation, use them
                        panels = scope.onCreatePanels;
                    } else { //Otherwise, use the default create panels
                        panels = [{ title: 'Create item', type: 'createItem' }];
                    }
                    return panels;
                }
                /** End of private methods **/
            }
        };
    }]);
})();