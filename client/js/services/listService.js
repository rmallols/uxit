(function () {
    'use strict';
    COMPONENTS.factory('listService', ['$rootScope', '$location', 'crudService', 'dbService', 'i18nService', 'arrayService', 'editBoxUtilsService',
    function ($rootScope, $location, crudService, dbService, i18nService, arrayService, editBoxUtilsService) {

        /**
         * Gets a list of items from a given collection
         *
         * @param {object}      options     The settings that will define the query to execute (collection, filters...)
         * @param {function}    callback    The function to execute once the list has been loaded
         */
        function loadList(options, callback) {
            var filter = {
                q           :   { $and: [
                                    { $or: getFilterOptions(options.searchText, options.searchTargets) },
                                    { $or: getTagOptions(options.tags) }
                                ]},
                currentPage :   options.currentPage,
                pageSize    :   options.pageSize,
                skip        :   options.skip,
                sort        :   options.sort,
                projection  :   options.projection
            };
            crudService.get(options.collection, null, filter, function (list) {
                if(callback) { callback(list); }
            });
        }

        /**
         *
         *
         * @param listScope
         * @param element
         * @param item
         * @param $index
         * @param $event
         * @param editOnSelect
         */
        function clickOnItem(listScope, element, item, $index, $event, editOnSelect) {
            if (listScope.isSelectable() || listScope.isEditable()) {
                handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event);
            } else {
                handleNavigationMechanism(listScope, item);
            }
            if (listScope.onSelect) {
                handleCustomSelectionMechanism(listScope, item, $index);
            }
        }

        /**
         *
         *
         * @param listScope
         * @param item
         */
        function selectItem(listScope, item) {
            if (listScope.isMultiSelectable()) {
                if (!listScope.selectedIds) { listScope.selectedIds = []; }
                if (!item.isSelected) { //Select the item if it wasn't selected before
                    listScope.selectedIds.push(item._id);
                }
            }
            else if (listScope.isSingleSelectable()) {
                listScope.selectedIds = item._id;
                if (listScope.lastSelectedItem) {
                    listScope.lastSelectedItem.isSelected = false;
                }
            }
            listScope.lastSelectedItem = item;
            item.isSelected = true;
            if(!$rootScope.$$phase) {
                listScope.$apply();
            }
        }

        /**
         *
         *
         * @param listScope
         * @param item
         */
        function unselectItem(listScope, item) {
            if (listScope.isMultiSelectable()) {
                if (item.isSelected) {
                    deleteFromSeletedIds(listScope, item._id);
                }
            }
            else if (listScope.isSingleSelectable()) {
                listScope.selectedIds = null; }
            item.isSelected = false;
            if(!$rootScope.$$phase) {
                listScope.$apply();
            }
        }

        /**
         * Deletes an item from the list
         *
         * @param {string} collection   The collection where the item to be removed is
         * @param {string} itemId       The Id of the item that is going to be removed
         */
        function deleteItem(collection, itemId) {
            crudService.delete(collection, itemId, null);
        }

        /**
         *
         *
         * @param listScope
         * @param detailId
         */
        function setDetailId(listScope, detailId) {
            listScope.detailId = detailId;
        }

        /**
         *
         *
         * @param listScope
         * @param id
         */
        function deleteFromSeletedIds(listScope, id) {
            var itemSelectedPos = getItemSelectedPos(listScope, id);
            //Delete the item from the selected items list, just if it was actually selected
            if (itemSelectedPos !== undefined) {
                arrayService.delete(listScope.selectedIds, itemSelectedPos);
            }
        }

        /** Private methods **/
        function getFilterOptions(searchText, searchTargets) {
            var filterOptions = [], currentLanguage = i18nService.getCurrentLanguage(),
                inexactSelector = dbService.getInexactSelector(searchText);
            searchTargets.forEach(function (searchTarget) {
                var filterOption = {}, i18nFilterOption = {}, i18nSearchTarget;
                filterOption[searchTarget] = inexactSelector;
                filterOptions.push(filterOption);     //Add plain text filter
                i18nSearchTarget = searchTarget + '.' + currentLanguage + '.text';
                i18nFilterOption[i18nSearchTarget] = inexactSelector;
                filterOptions.push(i18nFilterOption); //Add i18n text filter
            });
            return filterOptions;
        }

        function getTagOptions(tags) {
            var tagOptions = [];
            if (tags) {
                tags.forEach(function (tag) {
                    tagOptions[tagOptions.length] = { tag: tag };
                });
            }
            return tagOptions;
        }

        function getItemSelectedPos(listScope, itemId) {
            var itemSelectedPos = null, i;
            if (listScope.selectedIds) {
                for (i = 0; i < listScope.selectedIds.length; i += 1) {
                    if (listScope.selectedIds[i] === itemId) {
                        itemSelectedPos = i;
                        break;
                    }
                }
            }
            return itemSelectedPos;
        }

        function handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event) {
            if (!item.isSelected) {
                listScope.select(item);
                if (listScope.isEditable() && editOnSelect) { showEditBox(listScope, element, item); }
                //Close edit box it the user click has been outside of it
            } else if (!$event || !editBoxUtilsService.isEditBoxClicked($event)) {
                listScope.unselect(item);
                if (listScope.isEditable()) { hideEditBox(); }
            }
        }

        function handleCustomSelectionMechanism(listScope, item, $index) {
            listScope.onSelect(item, $index, listScope.isSelectable());
        }

        function handleNavigationMechanism(listScope, item) {
            setDetailId(listScope, item._id);
            $location.search('detailId', item._id);
        }

        function showEditBox(listScope, element, item) {
            var targetObj = $('#' + item._id + ' > *:first-child', element);
            hideEditBox(); //Hide any other previous instance of the edit box component
            listScope.panels = listScope.onSelectPanels;
            listScope.model = item;
            listScope.onClose = function () { listScope.unselect(item); };
            editBoxUtilsService.showEditBox(listScope, targetObj, targetObj);
        }

        function hideEditBox() {
            editBoxUtilsService.hideEditBox(null);
        }
        /** End of private methods **/

        return {
            loadList : loadList,
            deleteItem: deleteItem,
            clickOnItem: clickOnItem,
            selectItem: selectItem,
            unselectItem: unselectItem,
            deleteFromSeletedIds: deleteFromSeletedIds,
            setDetailId: setDetailId
        };
    }]);
})();
