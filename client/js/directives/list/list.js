(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', '$compile', '$timeout', 'rowService', 'listService', 'listSelectService',
    'roleService', 'sessionService', 'objectService', 'tooltipService',
    function ($rootScope, $location, $compile, $timeout, rowService, listService, listSelectService,
              roleService, sessionService, objectService, tooltipService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'list.html',
            scope : {
                items           : '=list',
                collection      : '=',
                config          : '=',
                projection      : '=',
                currentPage     : '=',
                transcludedData : '=',
                onSelectPanels  : '=',
                template        : '=',
                onSelect        : '&',
                onCreate        : '&',
                onDelete        : '&',
                onSearch        : '&',
                dbSource        : '@'
            },
            link: function link(scope, element) {

                scope.isPageActionsTop = function () {
                    var pageActionPos = listService.getDefaultValue('pageActionPos', scope.config),
                        normalizedPageActionPos = Number(pageActionPos);
                    return normalizedPageActionPos === 0 || normalizedPageActionPos === 2;
                };

                scope.isPageActionsBottom = function () {
                    var pageActionPos = listService.getDefaultValue('pageActionPos', scope.config),
                        normalizedPageActionPos = Number(pageActionPos);
                    return normalizedPageActionPos === 1 || normalizedPageActionPos === 2;
                };

                scope.select = function (item) {
                    listSelectService.selectItem(scope, item);
                };

                scope.unselect = function (item) {
                    listSelectService.unselectItem(scope, item);
                };

                scope.clickOnItem = function (item, $index, $event, editOnSelect) {
                    listSelectService.clickOnItem(scope, element, item, $index, $event, editOnSelect);
                };

                scope.getWrapperClass = function () {
                    var isSelectable    = (scope.isSelectable()) ? 'selectable' : '',
                        isEditable      = (scope.isEditable()) ? 'editable' : '';
                    return isSelectable +  ' '  + isEditable;
                };

                scope.getItemStyleClasses = function (item) {
                    var maxColSize = rowService.getMaxSlots(),
                        columnWidth = (scope.config.columns) ? Math.floor(maxColSize / scope.config.columns) : maxColSize,
                        viewMode = (scope.detailId) ? 'detailView': 'listView';
                    return 'large-' + columnWidth + ' ' + viewMode + ' ' + (item.isSelected ? 'active' : '');
                };

                scope.createItem = function(item) {
                    scope.onCreate({$item: item});
                };

                scope.deleteItem = function (id) {
                    listSelectService.dropFromSelectedList(scope, id);
                    tooltipService.hide();
                    scope.onDelete({$id: id});
                };

                scope.deleteDetailId = function() {
                    $location.search('detailId', null);
                };

                scope.isSearchable = function () { return listService.getDefaultValue('searchable', scope.config); };
                scope.isSelectable = function () { return scope.isSingleSelectable() || scope.isMultiSelectable(); };
                scope.isSingleSelectable = function () { return allowIfHasAdminRole(scope.config.selectable); };
                scope.isMultiSelectable = function () { return allowIfHasAdminRole(scope.config.multiSelectable); };
                scope.isEditable = function () { return allowIfHasAdminRole(scope.config.editable); };
                scope.isDeletable = function () { return allowIfHasAdminRole(scope.config.deletable); };
                scope.isCreatable = function () { return allowIfHasAdminRole(scope.config.creatable); };

                scope.getFilter = function() {
                    return (scope.dbSource == 'true') ? '' : scope.searchText;
                };

                scope.executeSearch = function() {
                    scope.onSearch({$text: scope.searchText});
                };

                scope.page = 0;
                if(scope.currentPage !== undefined) { scope.currentPage = scope.page; }

                listService.setDetailId(scope, $location.search().detailId);
                scope.$on('$routeUpdate', function(){
                    listService.setDetailId(scope, $location.search().detailId);
                });

                /** Private methods **/
                function allowIfHasAdminRole(action) { return (isAdmin()) ? action : false; }

                function isAdmin() {
                    var userSession = sessionService.getUserSession();
                    return roleService.hasAdminRole(userSession);
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);
