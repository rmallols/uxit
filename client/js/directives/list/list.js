(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', 'rowService', 'listService', 'listSelectService',
    'roleService', 'sessionService', 'objectService', 'tooltipService',
    function ($rootScope, $location, rowService, listService, listSelectService,
              roleService, sessionService, objectService, tooltipService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: 'list.html',
            require: '?ngModel, config',
            scope : {
                _id             : '=id',
                collection      : '=',
                items           : '=list',
                config          : '=',
                projection      : '=',
                searchTargets   : '=',
                transcludedData : '=',
                onSelectPanels  : '=',
                onSelect        : '&'
            },
            link: function link(scope, element) {

                var userSession = sessionService.getUserSession(),
                    defaultOptions = {  pageSize: 10, skip: 0, pageActionPos: 2, searchable : true,
                                        sort: { field: 'create.date', order : '1' } };

                scope.search = function () { scope.loadList(); };

                scope.isPageActionsTop = function () {
                    var pageActionPos = Number(scope.getDefaultedValue('pageActionPos'));
                    return pageActionPos === 0 || pageActionPos === 2;
                };

                scope.isPageActionsBottom = function () {
                    var pageActionPos = Number(scope.getDefaultedValue('pageActionPos'));
                    return pageActionPos === 1 || pageActionPos === 2;
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

                scope.getDefaultedValue = function (scopeProp) {
                    return (!objectService.isEmpty(scope.config[scopeProp]))
                        ? scope.config[scopeProp] : defaultOptions[scopeProp];
                };

                scope.delete = function (id) {
                    listService.deleteItem(scope.collection, id);
                    listSelectService.dropFromSelectedList(scope, id);
                    tooltipService.hide();
                    scope.loadList();
                };

                scope.deleteDetailId = function() {
                    $location.search('detailId', null);
                };

                scope.loadList = function () {
                    var options = {
                            collection      : scope.collection,
                            searchText      : scope.searchText,
                            searchTargets   : scope.searchTargets,
                            currentPage     : scope.currentPage,
                            pageSize        : scope.getDefaultedValue('pageSize'),
                            skip            : scope.getDefaultedValue('skip'),
                            sort            : scope.getDefaultedValue('sort'),
                            projection      : scope.projection
                    };
                    listService.loadList(options, function(list) {
                        scope.totalSize = list.totalSize;
                        scope.items = list.results;
                    });
                };

                console.log("T", scope.config);
                setTimeout(function() {
                    console.log("X", scope.config);

                }, 500);

                scope.isSearchable = function () { return scope.getDefaultedValue('searchable'); };
                scope.isSelectable = function () { return scope.isSingleSelectable() || scope.isMultiSelectable(); };
                scope.isSingleSelectable = function () { return allowIfHasAdminRole(scope.config.selectable); };
                scope.isMultiSelectable = function () { return allowIfHasAdminRole(scope.config.multiSelectable); };
                scope.isEditable = function () { return allowIfHasAdminRole(scope.config.editable); };
                scope.isDeletable = function () { return allowIfHasAdminRole(scope.config.deletable); };
                scope.isCreatable = function () { return allowIfHasAdminRole(scope.config.creatable); };

                //Load the list just once some meaningful data is provided as otherwise the current directive
                //could try to get data before it's provided from the invoking function
                scope.$watch('collection', function () {
                    scope.loadList();
                    //Reload changes everytime the change flag is received
                    $rootScope.$on(scope.collection + 'Changed', function () { scope.loadList(); });
                });
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
})(window.Math, window.Number, window.COMPONENTS);