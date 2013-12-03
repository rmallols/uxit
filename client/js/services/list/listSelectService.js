(function () {
    'use strict';

    COMPONENTS.factory('listSelectService', ['$rootScope', '$location', 'listService',
    'editBoxUtilsService', 'arrayService', 'stdService',
    function ($rootScope, $location, listService, editBoxUtilsService, arrayService, stdService) {

        /**
         * Action to execute whenever an item is clicked
         *
         * @param {object}  listScope       The scope of the list
         * @param {object}  element         The pointer to the DOM object where the list is
         * @param {object}  item            The model of the clicked item
         * @param {number}  $index          The numeric index of the clicked item in the list where it is
         * @param {object}  $event          The object with the data of the click event
         * @param {boolean} editOnSelect    The flag to identify if the item has to be edited while selecting or not
         */
        function clickOnItem(listScope, element, item, $index, $event, editOnSelect) {
            checkItemId(item);
            if (listScope.isSelectable() || listScope.isEditable()) {
                handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event);
            } else {
                handleNavigationMechanism(listScope, item);
            }
            handleCustomSelectionMechanism(listScope, item, $index);
        }

        /**
         * Selects a given item
         *
         * @param {object}  listScope   The scope of the list
         * @param {object}  item        The model of the element that is going to be selected
         */
        function selectItem(listScope, item) {
            checkItemId(item);
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
         * Unselects a given item
         *
         * @param {object}  listScope   The scope of the list
         * @param {object}  item        The model of the element that is going to be unselected
         */
        function unselectItem(listScope, item) {
            checkItemId(item);
            if (listScope.isMultiSelectable()) {
                if (item.isSelected) {
                    dropFromSelectedList(listScope, item._id);
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
         * Drops a given item from the selected list
         *
         * @param {object}  listScope   The scope of the list
         * @param {string}  id          The Id of the item that is going to be dropped from the list of selected items
         */
        function dropFromSelectedList(listScope, id) {
            var itemSelectedPos = getItemSelectedPos(listScope, id);
            //Delete the item from the selected items list, just if it was actually selected
            if (itemSelectedPos !== undefined) {
                arrayService.delete(listScope.selectedIds, itemSelectedPos);
            }
        }

        /** Private methods **/
        function checkItemId(item) {
            if(!item._id) {
                stdService.error('The matched element has to contain an _id attribute');
            }
        }

        function handleDefaultSelectionMechanism(listScope, element, item, editOnSelect, $event) {
            if (!item.isSelected) {
                listScope.select(item);
                if (listScope.isEditable() && editOnSelect) { showEditBox(listScope, element, item); }
                //Close edit box it the user click has been outside of it
            } else if (!$event || !editBoxUtilsService.isEditBoxClicked($event)) {
                listScope.unselect(item);
                if (listScope.isEditable()) { hideSiblingEditBox(); }
            }
        }

        function handleCustomSelectionMechanism(listScope, item) {
            listScope.onSelect({$item: item});
        }

        function handleNavigationMechanism(listScope, item) {
            listService.setDetailId(listScope, item._id);
            $location.search('detailId', item._id);
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

        function showEditBox(listScope, element, item) {
            var targetObj = $('#' + item._id + ' > *:first-child', element);
            hideSiblingEditBox(element); //Hide any other previous instance of the edit box component
            listScope.panels = listScope.onEditPanels;
            listScope.panels.forEach(function(panel) {
                if(!panel.bindings) { panel.bindings = {}; }
                panel.bindings.model = item;
            });
            listScope.onSave = function() { listScope.onEdit({$item: listScope.model}); };
            listScope.onClose = function () { listScope.unselect(item); };
            editBoxUtilsService.showEditBox(listScope, targetObj, targetObj);
        }

        function hideSiblingEditBox(element) {
            var parentEditBox, siblingEditBoxId;
            if(element) {
                parentEditBox = element.closest('.editBox');
                siblingEditBoxId = $('.editBox', parentEditBox).attr('id');
                if(siblingEditBoxId) {
                    editBoxUtilsService.hideEditBox(siblingEditBoxId);
                }
            }
        }
        /** End of private methods **/

        return {
            clickOnItem: clickOnItem,
            selectItem: selectItem,
            unselectItem: unselectItem,
            dropFromSelectedList: dropFromSelectedList
        };
    }]);
})();
