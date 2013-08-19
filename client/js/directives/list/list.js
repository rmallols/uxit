(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', 'portalService', 'rowService', 'crudService',
    'editBoxUtilsService', 'domService', 'arrayService', 'roleService', 'stringService', 'dbService', 'i18nService',
    function ($rootScope, $location, portalService, rowService, crudService, editBoxUtilsService, domService, arrayService,
              roleService, stringService, dbService, i18nService) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            templateUrl: '/client/html/list/list.html',
            require: '?ngModel, config',
            scope : {
                _id             : '=id',
                collection      : '=',
                items           : '=list',
                config          : '=',
                onSelect        : '=',
                onSelectPanels  : '=',
                projection      : '=',
                searchTargets   : '=',
                refreshList     : '=',
                transcludedData : '='
            },
            link: function link(scope, element) {

                var lastSelectedItem,
                    defaultOptions = { pageSize: 10, skip: 0, pageActionPos: 2, searchable : true,
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
                    if (scope.isMultiSelectable()) {
                        if (!scope.selectedIds) { scope.selectedIds = []; }
                        if (!item.isSelected) { //Select the item if it wasn't selected before
                            scope.selectedIds.push(item._id);
                        }
                    }
                    else if (scope.isSingleSelectable()) {
                        scope.selectedIds = item._id;
                        if (lastSelectedItem) { lastSelectedItem.isSelected = false; }
                    }
                    lastSelectedItem = item;
                    item.isSelected = true;
                };

                scope.unselect = function (item) {
                    if (scope.isMultiSelectable()) {
                        if (item.isSelected) {
                            deleteFromSeletedIds(item._id);
                        }
                    }
                    else if (scope.isSingleSelectable()) { scope.selectedIds = null; }
                    item.isSelected = false;
                };

                scope.selectItem = function (item, $index, $event, editOnSelect) {
                    //Toggle selection only if the item is selectable
                    if (scope.isSelectable()) {
                        if (!item.isSelected) {
                            scope.select(item);
                            if (scope.isEditable() && editOnSelect) { showEditBox(item); }
                            //Close edit box it the user click has been outside of it
                        } else if (!$event || !editBoxUtilsService.isEditBoxClicked($event)) {
                            scope.unselect(item);
                            if (scope.isEditable()) { hideEditBox(); }
                        }
                        if (scope.onSelect) { scope.onSelect(item, $index, scope.isSelectable()); }
                    } else {
                        setNavigateId(item._id);
                        $location.search('_id', scope._id);
                        $location.search('navigateId', item._id);
                    }
                };

                scope.getWrapperClass = function () { return (scope.isSelectable()) ? 'selectable' : ''; };

                scope.getItemStyleClasses = function (item) {
                    var maxColSize = rowService.getMaxSlots(),
                        columnWidth = (scope.config.columns) ? Math.floor(maxColSize / scope.config.columns) : maxColSize;
                    return 'large-' + columnWidth + ' ' + (item.isSelected ? 'active' : '');
                };

                scope.getDefaultedValue = function (scopeProp) {
                    return (!stringService.isEmpty(scope.config[scopeProp]))
                        ? scope.config[scopeProp] : defaultOptions[scopeProp];
                };

                scope.delete = function (id) {
                    crudService.delete(scope.collection, id, null);
                    deleteFromSeletedIds(id);
                    scope.loadList();
                };

                scope.loadList = function () {
                    var filter = {
                        q           : { $and: [{ $or: getFilterOptions() }, { $or: getTagOptions() }]},
                        currentPage : scope.currentPage,
                        pageSize    : scope.getDefaultedValue('pageSize'),
                        skip        : scope.getDefaultedValue('skip'),
                        sort        : scope.getDefaultedValue('sort'),
                        projection  : scope.projection
                    };
                    crudService.get(scope.collection, null, filter, function (list) {
                        scope.totalSize = list.totalSize;
                        scope.items = list.results;
                    });
                };

                scope.isSearchable = function () { return scope.getDefaultedValue('searchable'); };
                scope.isSelectable = function () { return scope.isSingleSelectable() || scope.isMultiSelectable(); };
                scope.isSingleSelectable = function () { return allowIfHasAdminRole(scope.config.selectable); };
                scope.isMultiSelectable = function () { return allowIfHasAdminRole(scope.config.multiSelectable); };
                scope.isEditable = function () { return allowIfHasAdminRole(scope.config.editable); };
                scope.isDeletable = function () { return allowIfHasAdminRole(scope.config.deletable); };

                if (scope.refreshList) {
                    scope.refreshList = function () {
                        setCurrentPage();
                        scope.loadList();
                    };
                }

                //Load the list just once some meaningful data is provided as otherwise the current directive
                //could try to get data before it's provided from the invoking function
                scope.$watch('collection', function () { scope.loadList(); });
                scope.searchText = '';
                scope.currentPage = 0;
                //Reload changes everytime the change flag is received
                $rootScope.$on(scope.collection + 'Changed', function () { scope.loadList(); });
                setNavigateId($location.search().navigateId);
                scope.$on('$routeUpdate', function(){
                    setNavigateId($location.search().navigateId);
                });

                /** Private methods **/
                function showEditBox(item) {
                    var targetObj = $('#' + item._id + ' > *:first-child', element);
                    hideEditBox(); //Hide any other previous instance of the edit box component
                    scope.panels = scope.onSelectPanels;
                    scope.model = item;
                    scope.onClose = function () { scope.unselect(item); };
                    editBoxUtilsService.showEditBox(scope, targetObj, targetObj);
                }

                function hideEditBox() { editBoxUtilsService.hideEditBox(null); }

                function allowIfHasAdminRole(action) { return (isAdmin()) ? action : false; }

                function isAdmin() { return roleService.hasAdminRole($rootScope.portal.user); }

                function setCurrentPage() {
                    //Avoid pointing to a out of index page
                    if ((scope.currentPage + 1) * scope.getDefaultedValue('pageSize') > scope.totalSize) {
                        scope.currentPage = Math.floor(scope.totalSize / scope.getDefaultedValue('pageSize'));
                    }
                }

                function deleteFromSeletedIds(id) {

                    function getItemSelectedPos(itemId) {
                        var itemSelectedPos = null, i;
                        if (scope.selectedIds) {
                            for (i = 0; i < scope.selectedIds.length; i += 1) {
                                if (scope.selectedIds[i] === itemId) {
                                    itemSelectedPos = i;
                                    break;
                                }
                            }
                        }
                        return itemSelectedPos;
                    }

                    var itemSelectedPos = getItemSelectedPos(id);
                    if (itemSelectedPos) { //Delete the item from the selected items list, just if it was actually selected
                        arrayService.delete(scope.selectedIds, itemSelectedPos);
                    }
                }

                function getFilterOptions() {
                    var filterOptions = [], currentLanguage = i18nService.getCurrentLanguage(),
                        inexactSelector = dbService.getInexactSelector(scope.searchText);
                    scope.searchTargets.forEach(function (searchTarget) {
                        var filterOption = {}, i18nFilterOption = {}, i18nSearchTarget;
                        filterOption[searchTarget] = inexactSelector;
                        filterOptions.push(filterOption);     //Add plain text filter
                        i18nSearchTarget = searchTarget + '.' + currentLanguage + '.text';
                        i18nFilterOption[i18nSearchTarget] = inexactSelector;
                        filterOptions.push(i18nFilterOption); //Add i18n text filter
                    });
                    return filterOptions;
                }

                function getTagOptions() {
                    var tagOptions = [];
                    if (scope.config.tags) {
                        scope.config.tags.forEach(function (tag) {
                            tagOptions[tagOptions.length] = { tag: tag };
                        });
                    }
                    return tagOptions;
                }

                function setNavigateId(navigateId) {
                    scope.navigateId = navigateId;
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);