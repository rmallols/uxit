(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('nestedItemsWrapper', ['globalMsgService', 'i18nService', 'timerService', '$timeout',
    function (globalMsgService, i18nService, timerService, $timeout) {
        return {
            //require: 'selectedItem',
            restrict: 'E',
            replace: true,
            template:   '<div>' +
                '<nested-items items="items" sortable-options="sortableOptions" selected-item="selectedItem" ' +
                'on-select="onSelectItem($item)" on-add="onAddItem($item)" on-delete="onDeleteItem($item)"></nested-items>' +
                '<button class="addIcon floatRight" ng-click="addRootItem()"></button>' +
                '</div>',
            scope: {
                items: '=',
                selectedItem: '=',
                onSelect: '&',
                onAdd: '&'
            },
            link: function link(scope) {

                /* PRIVATE METHODS */
                function addItem(siblingItems) {
                    var newItem = {
                        _id     : timerService.getRandomNumber(),
                        text    : i18nService('editPages.newPage'),
                        items   : [],
                        position: scope.items.length,
                        added   : true
                    };
                    siblingItems.push(newItem);
                    scope.onSelectItem(newItem);
                    if (scope.onAdd) {
                        scope.onAdd({$item: newItem});
                    }
                }

                function deleteItem(item) {
                    item.deleted = true;
                    if (item.items) { //Recursively delete all the subitems as well
                        item.items.forEach(function (item) {
                            deleteItem(item);
                        });
                    }
                }

                function undeleteItem(item) {
                    item.deleted = false;
                    if (item.items) { //Recursively undelete all the subitems as well
                        item.items.forEach(function (item) {
                            undeleteItem(item);
                        });
                    }
                }

                function getNonDeletedItems(items) {
                    var nonDeletedItems = [];
                    items.forEach(function (item) {
                        if (!item.deleted) {
                            nonDeletedItems.push(item);
                            getNonDeletedItems(item.items).forEach(function (item) {
                                nonDeletedItems.push(item);
                            });
                        }
                    });
                    return nonDeletedItems;
                }

                function onUpdate() {
                    //It's necessary to apply a delay before marking all items
                    //as updated as otherwise the changes won't be applied
                    $timeout(function () {
                        markAllItemsAsUpdated();
                    }, 0);
                }

                function markAllItemsAsUpdated(items, accumulativeIndex) {
                    if (items) {
                        accumulativeIndex += 1;
                    } else {
                        items = scope.items;
                        accumulativeIndex = 0;
                    }
                    items.forEach(function (item, index) {
                        item.updated = true;
                        item.position = index + accumulativeIndex;
                        markAllItemsAsUpdated(item.items, item.position);
                    });
                }
                /* END PRIVATE METHODS */

                scope.sortableOptions = {
                    items               : 'li',
                    connectWith         : '[ui-sortable]',
                    placeholder         : 'sortingPlaceholder',
                    forceHelperSize     : true,
                    forcePlaceholderSize: true,
                    tolerance           : 'pointer',
                    cursorAt            : { top: 0, left: 0 },
                    handle              : '.sortingBox',
                    update              : onUpdate
                };

                scope.onSelectItem = function (item) {
                    if (scope.onSelect) {
                        scope.onSelect({$item: item});
                    }
                };

                scope.addRootItem = function () {
                    addItem(scope.items);
                };

                scope.onAddItem = function (item) {
                    addItem(item.items);
                };

                scope.onDeleteItem = function (item) {
                    var canBeDeleted, nonDeletedItemFound = false;
                    deleteItem(item);
                    canBeDeleted = getNonDeletedItems(scope.items).length > 0;
                    if (canBeDeleted) {
                        if (item._id === scope.selectedItem._id) {
                            scope.items.forEach(function (item) {
                                if (!item.deleted && !nonDeletedItemFound) {
                                    scope.selectedItem = item;
                                    nonDeletedItemFound = true;
                                }
                            });
                        }
                    } else {
                        undeleteItem(item);
                        globalMsgService.show(i18nService('editPages.cannotDeletePage'));
                    }
                };
            }
        };
    }]);
})(window.COMPONENTS);