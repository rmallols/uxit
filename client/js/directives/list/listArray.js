(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('listArray', ['$rootScope', '$location', '$compile', '$timeout', 'rowService', 'listService', 'listSelectService',
    'roleService', 'sessionService', 'objectService', 'tooltipService',
    function ($rootScope, $location, $compile, $timeout, rowService, listService, listSelectService,
              roleService, sessionService, objectService, tooltipService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'listArray.html',
            priority: -1,
            //require: '?ngModel, config',
            scope : {
                items           : '=listArray',
                config          : '=',
                projection      : '=',
                transcludedData : '=',
                onSelectPanels  : '=',
                template        : '=',
                //searchText      : '=',
                //currentPage     : '=',
                onSelect        : '&',
                onDelete        : '&'
            },
            link: function link(scope, element) {

                var userSession = sessionService.getUserSession();

                console.log("A VER QUE HACEMOS CON LA BUSQUEDA")
                //scope.search = function () { scope.loadList(); };

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

                scope.searchText = '';
                scope.currentPage = 0;
                listService.setDetailId(scope, $location.search().detailId);
                scope.$on('$routeUpdate', function(){
                    listService.setDetailId(scope, $location.search().detailId);
                });

                /** Private methods **/
                function allowIfHasAdminRole(action) { return (isAdmin()) ? action : false; }

                function isAdmin() { return roleService.hasAdminRole(userSession); }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('uxTransclude', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                template: '=uxTransclude'
            },
            link: function link(scope, element) {
                console.log("MOVERLO A UN NUEVO ARCHIVO!")
                var newContent = $(scope.template);
                element.html(newContent);
                $compile(newContent)(scope.$parent);
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);
