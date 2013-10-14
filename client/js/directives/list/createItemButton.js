(function() {
    COMPONENTS.directive('createItemButton', ['$injector', 'crudService', 'editBoxUtilsService',
    function ($injector, crudService, editBoxUtilsService) {
        return {
            restrict: 'A',
            scope: {
                collection: '=',
                onCreate: '&'
            },
            link: function link(scope, element) {

                scope.createItem = function () {
                    createItem();
                };

                /** Private methods **/
                function createItem() {
                    scope.panels = [{ title: 'Create item', type: 'createItem' }];
                    scope.internalData = {
                        collection: scope.collection,
                        data: {}
                    };
                    scope.onSave = function() {
                        scope.onCreate({$item: scope.internalData.data});
                    };
                    editBoxUtilsService.showEditBox(scope, element, element);
                }
                /** End of private methods **/
            }
        };
    }]);
})();