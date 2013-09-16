(function (Number) {
    'use strict';
    COMPONENTS.directive('listActions', ['arrayService', function (arrayService) {
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
                    return scope.getDefaultedValue('pageSize') && scope.currentPage > 0;
                };

                scope.showNextPageLink = function () {
                    return (scope.currentPage + 1) * Number(scope.getDefaultedValue('pageSize')) < scope.totalSize;
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
            }
        };
    }]);
})(window.Number);