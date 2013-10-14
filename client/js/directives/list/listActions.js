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
                        scope.deleteItem(id);
                    });
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Number);