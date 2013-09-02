(function (Math, Number, COMPONENTS) {
    'use strict';
    COMPONENTS.directive('list', ['$rootScope', '$location', 'portalService', 'rowService', 'crudService',
    'editBoxUtilsService', 'domService', 'arrayService', 'roleService', 'sessionService', 'stringService', 'dbService',
    'i18nService', 'tooltipService',
    function ($rootScope, $location, portalService, rowService, crudService, editBoxUtilsService, domService, arrayService,
              roleService, sessionService, stringService, dbService, i18nService, tooltipService) {
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

                var lastSelectedItem, userSession = sessionService.getUserSession(),
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
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                };

                scope.unselect = function (item) {
                    if (scope.isMultiSelectable()) {
                        if (item.isSelected) {
                            deleteFromSeletedIds(item._id);
                        }
                    }
                    else if (scope.isSingleSelectable()) { scope.selectedIds = null; }
                    item.isSelected = false;
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                };

                scope.selectItem = function (item, $index, $event, editOnSelect) {
                    if (scope.isSelectable() || scope.isEditable()) {
                        handleDefaultSelectionMechanism(item, editOnSelect, $event);
                    } else {
                        handleNavigationMechanism(item);
                    }
                    if (scope.onSelect) {
                        handleCustomSelectionMechanism(item, $index);
                    }
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
                    return (!stringService.isEmpty(scope.config[scopeProp]))
                        ? scope.config[scopeProp] : defaultOptions[scopeProp];
                };

                scope.delete = function (id) {
                    crudService.delete(scope.collection, id, null);
                    deleteFromSeletedIds(id);
                    tooltipService.hide();
                    scope.loadList();
                };

                scope.deleteDetailId = function() {
                    $location.search('detailId', null);
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

                var unregister = scope.$watch('refreshList', function(newVal) {
                    if(newVal) {
                        unregister();
                        scope.refreshList = function () {
                            setCurrentPage();
                            scope.loadList();
                        };
                    }
                });

                //Load the list just once some meaningful data is provided as otherwise the current directive
                //could try to get data before it's provided from the invoking function
                scope.$watch('collection', function () { scope.loadList(); });
                scope.searchText = '';
                scope.currentPage = 0;
                //Reload changes everytime the change flag is received
                $rootScope.$on(scope.collection + 'Changed', function () { scope.loadList(); });
                setDetailId($location.search().detailId);
                scope.$on('$routeUpdate', function(){
                    setDetailId($location.search().detailId);
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

                function isAdmin() { return roleService.hasAdminRole(userSession); }

                function setCurrentPage() {
                    //Avoid pointing to a out of index page
                    if ((scope.currentPage + 1) * scope.getDefaultedValue('pageSize') > scope.totalSize) {
                        scope.currentPage = Math.floor(scope.totalSize / scope.getDefaultedValue('pageSize'));
                    }
                }

                function deleteFromSeletedIds(id) {
                    var itemSelectedPos = getItemSelectedPos(id);
                    //Delete the item from the selected items list, just if it was actually selected
                    if (itemSelectedPos !== undefined) {
                        arrayService.delete(scope.selectedIds, itemSelectedPos);
                    }
                }

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

                function setDetailId(detailId) {
                    scope.detailId = detailId;
                }

                function handleDefaultSelectionMechanism(item, editOnSelect, $event) {
                    if (!item.isSelected) {
                        scope.select(item);
                        if (scope.isEditable() && editOnSelect) { showEditBox(item); }
                        //Close edit box it the user click has been outside of it
                    } else if (!$event || !editBoxUtilsService.isEditBoxClicked($event)) {
                        scope.unselect(item);
                        if (scope.isEditable()) { hideEditBox(); }
                    }
                }

                function handleCustomSelectionMechanism(item, $index) {
                    scope.onSelect(item, $index, scope.isSelectable());
                }

                function handleNavigationMechanism(item) {
                    setDetailId(item._id);
                    $location.search('detailId', item._id);
                }
                /** End of private methods **/
            }
        };
    }]);
})(window.Math, window.Number, window.COMPONENTS);