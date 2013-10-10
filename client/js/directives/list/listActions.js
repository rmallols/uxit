(function (Number) {
    'use strict';
    COMPONENTS.directive('listActions', ['arrayService', 'listService',
    function (arrayService, listService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'listActions.html',
            link: function link(scope) {

                scope.getPrevPage = function () {
                    scope.currentPage -= 1;
                    scope.loadList();
                };

                scope.getNextPage = function () {
                    scope.currentPage += 1;
                    scope.loadList();
                };

                scope.showPrevPageLink = function () {
                    return listService.getDefaultValue('pageSize', scope.config) && scope.currentPage > 0;
                };

                scope.showNextPageLink = function () {
                    var pageSize = Number(listService.getDefaultValue('pageSize', scope.config));
                    return (scope.currentPage + 1) * pageSize < scope.totalSize;
                };

                scope.toggleSelectAll = function () {
                    if (scope.selectedIds && scope.items.length === scope.selectedIds.length) {
                        unselectAll();
                    } else {
                        selectAll();
                    }
                };

                scope.deleteSelected = function () {
                    deleteSelected();
                };

                /** Private methods **/
                function selectAll() {
                    scope.items.forEach(function (item) {
                        scope.select(item);
                    });
                }

                function unselectAll() {
                    scope.items.forEach(function (item) {
                        scope.unselect(item);
                    });
                }

                function deleteSelected() {
                    var selectedIds = arrayService.copy(scope.selectedIds);
                    selectedIds.forEach(function (id) {
                        scope.delete(id);
                    });
                }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('createItemButton', ['$injector', 'crudService', 'editBoxUtilsService',
    function ($injector, crudService, editBoxUtilsService) {
        return {
            restrict: 'A',
            scope: {},
            link: function link(scope, element) {

                var collection = scope.$parent.collection;
                scope.createItem = function () {
                    createItem();
                };

                scope.$parent.$watch('collection', function(newVal) {
                    if(newVal) {
                        collection = scope.$parent.collection;
                    }
                });

                /** Private methods **/
                function createItem() {
                    scope.panels = [{ title: 'Create item', type: 'createItem' }];
                    scope.internalData = {
                        collection: collection,
                        data: {}
                    };
                    scope.onSave = function() {
                        crudService.create(collection, scope.internalData.data);
                    };
                    editBoxUtilsService.showEditBox(scope, element, element);
                }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('createItem', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            replace: false,
            template: '<div></div>',
            scope: {
                internalData: '='
            },
            link: function link(scope, element) {
                var layerElm = $('<div create-' + scope.internalData.collection + ' model="internalData.data"></div>');
                element.html(layerElm);
                $compile(layerElm)(scope);
            }
        };
    }]);
})(window.Number);